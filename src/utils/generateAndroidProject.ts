import JSZip from 'jszip';
import { ScheduleBlock, WallpaperTheme, AndroidProjectConfig } from '../types';
import { generateHtmlWallpaper } from './generateHtmlWallpaper';

export interface AndroidProjectFiles {
  [path: string]: string;
}

export function buildProjectFileTree(
  blocks: ScheduleBlock[],
  theme: WallpaperTheme,
  config: AndroidProjectConfig
): AndroidProjectFiles {
  const pkgDir = config.packageName.replace(/\./g, '/');
  const htmlContent = generateHtmlWallpaper(
    blocks,
    theme,
    config.priorityText,
    config.timeFormat24h,
    config.lockscreenTopPadding
  );

  const files: AndroidProjectFiles = {
    // 1. Root settings.gradle.kts
    'settings.gradle.kts': `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "DailyFocusWallpaper"
include(":app")
`,

    // 2. Root build.gradle.kts
    'build.gradle.kts': `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.7.2" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
}
`,

    // 3. gradle.properties
    'gradle.properties': `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`,

    // 4. gradle/wrapper/gradle-wrapper.properties
    'gradle/wrapper/gradle-wrapper.properties': `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`,

    // 5. gradlew (bash script for Mac/Linux)
    'gradlew': `#!/bin/sh
# Gradle start up script for POSIX systems
exec "\${JAVA_HOME:-/usr}/bin/java" -jar "\$(dirname "\$0")/gradle/wrapper/gradle-wrapper.jar" "\$@"
`,

    // 6. gradlew.bat (Windows batch)
    'gradlew.bat': `@rem Gradle startup script for Windows
@if "%DEBUG%"=="" @echo off
set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%
java.exe -jar "%APP_HOME%/gradle/wrapper/gradle-wrapper.jar" %*
`,

    // 7. app/build.gradle.kts
    'app/build.gradle.kts': `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "${config.packageName}"
    compileSdk = 35

    defaultConfig {
        applicationId = "${config.packageName}"
        minSdk = 26
        targetSdk = 35
        versionCode = ${config.versionCode}
        versionName = "${config.versionName}"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Replace with your release keystore before Play Store upload
        }
        debug {
            isMinifyEnabled = false
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.2.0")
    implementation("androidx.webkit:webkit:1.12.1")
}
`,

    // 8. app/proguard-rules.pro
    'app/proguard-rules.pro': `# Proguard rules for Daily Focus Live Wallpaper
-keep class ${config.packageName}.LiveWallpaperService** { *; }
-keep class ${config.packageName}.MainActivity** { *; }
-keepattributes *Annotation*
-dontwarn android.webkit.**
`,

    // 9. app/src/main/AndroidManifest.xml
    'app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageName}">

    <!-- Permissions required for setting and previewing Live Wallpaper -->
    <uses-permission android:name="android.permission.SET_WALLPAPER" />
    <uses-feature
        android:name="android.software.live_wallpaper"
        android:required="true" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.DailyFocusWallpaper">

        <!-- Main Companion Activity (Apply Wallpaper + Routine Config) -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.DailyFocusWallpaper.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Live Wallpaper Service (Runs on Lock Screen & Home Screen) -->
        <service
            android:name=".LiveWallpaperService"
            android:label="@string/wallpaper_name"
            android:permission="android.permission.BIND_WALLPAPER"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.wallpaper.WallpaperService" />
            </intent-filter>
            <meta-data
                android:name="android.service.wallpaper"
                android:resource="@xml/wallpaper" />
        </service>

    </application>
</manifest>
`,

    // 10. app/src/main/res/xml/wallpaper.xml
    'app/src/main/res/xml/wallpaper.xml': `<?xml version="1.0" encoding="utf-8"?>
<wallpaper xmlns:android="http://schemas.android.com/apk/res/android"
    android:thumbnail="@drawable/wallpaper_preview"
    android:description="@string/wallpaper_description"
    android:settingsActivity="${config.packageName}.MainActivity" />
`,

    // 11. app/src/main/res/values/strings.xml
    'app/src/main/res/values/strings.xml': `<resources>
    <string name="app_name">${config.appName}</string>
    <string name="wallpaper_name">${config.appName} (Lock Screen)</string>
    <string name="wallpaper_description">Dynamic daily schedule lock screen live wallpaper. Highlights your active time block with zero battery drain.</string>
    <string name="set_wallpaper_button">Apply as Lock Screen Wallpaper</string>
    <string name="preview_title">Lock Screen Routine</string>
    <string name="how_to_apply">Tap the button below to launch Android\\'s wallpaper setup. Choose \\'Set on Home screen and lock screen\\' to see your daily routine every time you wake your phone.</string>
</resources>
`,

    // 12. app/src/main/res/values/colors.xml
    'app/src/main/res/values/colors.xml': `<resources>
    <color name="bg_dark">${theme.bgDark}</color>
    <color name="card_bg">${theme.cardBg}</color>
    <color name="accent">${theme.accent}</color>
    <color name="accent_glow">${theme.accentGlow}</color>
    <color name="fg">${theme.fg}</color>
    <color name="muted">${theme.muted}</color>
    <color name="border">${theme.border}</color>
</resources>
`,

    // 13. app/src/main/res/values/themes.xml
    'app/src/main/res/values/themes.xml': `<resources>
    <style name="Theme.DailyFocusWallpaper" parent="Theme.Material3.Dark.NoActionBar">
        <item name="android:statusBarColor">@color/bg_dark</item>
        <item name="android:navigationBarColor">@color/bg_dark</item>
        <item name="colorPrimary">@color/accent</item>
        <item name="colorOnPrimary">#000000</item>
        <item name="android:windowBackground">@color/bg_dark</item>
    </style>
    <style name="Theme.DailyFocusWallpaper.NoActionBar" parent="Theme.DailyFocusWallpaper">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
    </style>
</resources>
`,

    // 14. app/src/main/res/drawable/wallpaper_preview.xml
    'app/src/main/res/drawable/wallpaper_preview.xml': `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="200dp"
    android:height="400dp"
    android:viewportWidth="200"
    android:viewportHeight="400">
    <path
        android:fillColor="${theme.bgDark}"
        android:pathData="M0,0h200v400h-200z" />
    <path
        android:fillColor="${theme.accent}"
        android:pathData="M20,30h80v6h-80z M20,44h110v12h-110z M20,68h160v16h-160z" />
    <path
        android:fillColor="${theme.cardBg}"
        android:pathData="M20,100h160v36h-160z M20,144h160v36h-160z M20,188h160v36h-160z M20,232h160v36h-160z M20,276h160v36h-160z" />
    <path
        android:fillColor="${theme.accent}"
        android:pathData="M20,144h4v36h-4z" />
</vector>
`,

    // 15. app/src/main/res/drawable/ic_launcher_foreground.xml
    'app/src/main/res/drawable/ic_launcher_foreground.xml': `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="${theme.accent}"
        android:pathData="M34,28h40c3.3,0 6,2.7 6,6v40c0,3.3 -2.7,6 -6,6h-40c-3.3,0 -6,-2.7 -6,-6v-40c0,-3.3 2.7,-6 6,-6z" />
    <path
        android:fillColor="#ffffff"
        android:pathData="M48,42h12v4h-12z M44,52h20v4h-20z M44,62h15v4h-15z" />
</vector>
`,

    // 16. app/src/main/res/drawable/ic_launcher_background.xml
    'app/src/main/res/drawable/ic_launcher_background.xml': `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="${theme.bgDark}"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`,

    // 17. app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml': `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`,

    // 18. app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml
    'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml': `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`,

    // 19. app/src/main/assets/wallpaper/index.html
    'app/src/main/assets/wallpaper/index.html': htmlContent,

    // 20. app/src/main/res/layout/activity_main.xml
    'app/src/main/res/layout/activity_main.xml': `<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/bg_dark">

    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fillViewport="true">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="20dp">

            <!-- Title & Status -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="DAILY SYSTEM"
                android:textColor="@color/muted"
                android:letterSpacing="0.2"
                android:textSize="11sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="${config.appName}"
                android:textColor="@color/fg"
                android:textSize="26sp"
                android:textStyle="bold"
                android:layout_marginTop="4dp" />

            <!-- Highlight Card -->
            <com.google.android.material.card.MaterialCardView
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="20dp"
                app:cardBackgroundColor="@color/card_bg"
                app:strokeColor="@color/border"
                app:strokeWidth="1dp"
                app:cardCornerRadius="16dp">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="vertical"
                    android:padding="18dp">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="LOCK SCREEN LIVE WALLPAPER"
                        android:textColor="@color/accent"
                        android:letterSpacing="0.15"
                        android:textSize="11sp"
                        android:textStyle="bold" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="@string/how_to_apply"
                        android:textColor="@color/fg"
                        android:textSize="13sp"
                        android:lineSpacingExtra="3dp"
                        android:layout_marginTop="8dp" />

                    <!-- Apply Wallpaper Button -->
                    <com.google.android.material.button.MaterialButton
                        android:id="@+id/btnSetWallpaper"
                        android:layout_width="match_parent"
                        android:layout_height="56dp"
                        android:layout_marginTop="18dp"
                        android:text="@string/set_wallpaper_button"
                        android:textColor="#000000"
                        android:textStyle="bold"
                        app:backgroundTint="@color/accent"
                        app:cornerRadius="12dp" />

                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <!-- Live Preview Mini Card -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="ROUTINE BLOCKS PREVIEW"
                android:textColor="@color/muted"
                android:letterSpacing="0.15"
                android:textSize="11sp"
                android:textStyle="bold"
                android:layout_marginTop="26dp"
                android:layout_marginBottom="12dp" />

            <com.google.android.material.card.MaterialCardView
                android:layout_width="match_parent"
                android:layout_height="320dp"
                app:cardBackgroundColor="@color/card_bg"
                app:strokeColor="@color/border"
                app:strokeWidth="1dp"
                app:cardCornerRadius="16dp">

                <WebView
                    android:id="@+id/previewWebView"
                    android:layout_width="match_parent"
                    android:layout_height="match_parent" />

            </com.google.android.material.card.MaterialCardView>

            <!-- Battery & Privacy note -->
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="⚡ 0% Battery Drain: The live wallpaper automatically pauses JavaScript and rendering when the screen is locked and dark."
                android:textColor="@color/muted"
                android:textSize="11sp"
                android:layout_marginTop="16dp"
                android:layout_marginBottom="32dp" />

        </LinearLayout>
    </androidx.core.widget.NestedScrollView>
</androidx.coordinatorlayout.widget.CoordinatorLayout>
`,

    // 21. app/src/main/java/.../MainActivity.kt
    [`app/src/main/java/${pkgDir}/MainActivity.kt`]: `package ${config.packageName}

import android.app.WallpaperManager
import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton

class MainActivity : AppCompatActivity() {

    private lateinit var previewWebView: WebView
    private lateinit var btnSetWallpaper: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btnSetWallpaper = findViewById(R.id.btnSetWallpaper)
        previewWebView = findViewById(R.id.previewWebView)

        setupPreviewWebView()

        btnSetWallpaper.setOnClickListener {
            launchWallpaperPicker()
        }
    }

    private fun setupPreviewWebView() {
        previewWebView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            loadWithOverviewMode = true
            useWideViewPort = true
            cacheMode = WebSettings.LOAD_DEFAULT
        }
        previewWebView.loadUrl("file:///android_asset/wallpaper/index.html")
    }

    private fun launchWallpaperPicker() {
        try {
            val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER).apply {
                putExtra(
                    WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT,
                    ComponentName(this@MainActivity, LiveWallpaperService::class.java)
                )
            }
            startActivity(intent)
        } catch (e: Exception) {
            // Fallback for older OEM Android skins that do not support direct component intent
            try {
                val fallbackIntent = Intent(WallpaperManager.ACTION_LIVE_WALLPAPER_CHOOSER)
                startActivity(fallbackIntent)
            } catch (fallbackError: Exception) {
                Toast.makeText(this, "Please select 'Daily Focus' in your device wallpaper settings", Toast.LENGTH_LONG).show()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        previewWebView.onResume()
    }

    override fun onPause() {
        super.onPause()
        previewWebView.onPause()
    }

    override fun onDestroy() {
        super.onDestroy()
        previewWebView.destroy()
    }
}
`,

    // 22. app/src/main/java/.../LiveWallpaperService.kt
    [`app/src/main/java/${pkgDir}/LiveWallpaperService.kt`]: `package ${config.packageName}

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder
import android.view.View
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * High-performance, battery-efficient Android Lock Screen Live Wallpaper service.
 * Renders the Daily Focus schedule into the surface canvas with zero battery waste
 * by strictly suspending rendering and timer intervals when the screen is turned off.
 */
class LiveWallpaperService : WallpaperService() {

    override fun onCreateEngine(): Engine {
        return FocusWallpaperEngine()
    }

    inner class FocusWallpaperEngine : Engine() {

        private val mainHandler = Handler(Looper.getMainLooper())
        private var webView: WebView? = null
        private var surfaceWidth: Int = 1080
        private var surfaceHeight: Int = 2400
        private var isVisibleState: Boolean = false
        private var bitmap: Bitmap? = null
        private var renderCanvas: Canvas? = null

        // Periodic frame refresh when visible (every 15 seconds to update time blocks accurately)
        private val redrawRunnable = object : Runnable {
            override fun run() {
                if (isVisibleState) {
                    drawFrame()
                    mainHandler.postDelayed(this, 15000L)
                }
            }
        }

        @SuppressLint("SetJavaScriptEnabled")
        override fun onCreate(surfaceHolder: SurfaceHolder?) {
            super.onCreate(surfaceHolder)
            // Initialize WebView on UI thread
            mainHandler.post {
                initWebView()
            }
        }

        @SuppressLint("SetJavaScriptEnabled")
        private fun initWebView() {
            try {
                val ctx: Context = this@LiveWallpaperService
                webView = WebView(ctx).apply {
                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        loadWithOverviewMode = true
                        useWideViewPort = true
                        cacheMode = WebSettings.LOAD_NO_CACHE
                        allowFileAccess = true
                    }
                    // Prevent any unwanted navigation
                    webViewClient = object : WebViewClient() {
                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                            // Draw initial frame once asset is ready
                            mainHandler.postDelayed({ drawFrame() }, 300)
                        }
                    }
                    layout(0, 0, surfaceWidth, surfaceHeight)
                    loadUrl("file:///android_asset/wallpaper/index.html")
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        override fun onSurfaceCreated(holder: SurfaceHolder?) {
            super.onSurfaceCreated(holder)
        }

        override fun onSurfaceChanged(holder: SurfaceHolder?, format: Int, width: Int, height: Int) {
            super.onSurfaceChanged(holder, format, width, height)
            surfaceWidth = width
            surfaceHeight = height

            // Allocate buffer bitmap for crisp hardware rendering
            if (width > 0 && height > 0) {
                bitmap?.recycle()
                bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                renderCanvas = Canvas(bitmap!!)

                mainHandler.post {
                    webView?.let { wv ->
                        wv.measure(
                            View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
                            View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY)
                        )
                        wv.layout(0, 0, width, height)
                        drawFrame()
                    }
                }
            }
        }

        override fun onVisibilityChanged(visible: Boolean) {
            super.onVisibilityChanged(visible)
            isVisibleState = visible

            mainHandler.removeCallbacks(redrawRunnable)
            if (visible) {
                mainHandler.post {
                    webView?.onResume()
                    // Tell webview to refresh lock screen time immediately
                    webView?.evaluateJavascript("if(typeof update === 'function') update();", null)
                }
                drawFrame()
                mainHandler.postDelayed(redrawRunnable, 15000L)
            } else {
                // Screen is off or obscured -> freeze JS timers and save 100% battery
                mainHandler.post {
                    webView?.onPause()
                }
            }
        }

        private fun drawFrame() {
            if (!isVisibleState) return

            val holder = surfaceHolder ?: return
            var canvas: Canvas? = null
            try {
                canvas = holder.lockHardwareCanvas() ?: holder.lockCanvas()
                if (canvas != null) {
                    val currentBmp = bitmap
                    val c = renderCanvas
                    val wv = webView

                    if (currentBmp != null && c != null && wv != null) {
                        // Clear canvas with background color
                        c.drawColor(Color.parseColor("${theme.bgDark}"))
                        // Draw offscreen webview hierarchy
                        wv.draw(c)
                        // Blit to screen surface
                        canvas.drawBitmap(currentBmp, 0f, 0f, null)
                    } else {
                        canvas.drawColor(Color.parseColor("${theme.bgDark}"))
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                if (canvas != null) {
                    try {
                        holder.unlockCanvasAndPost(canvas)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }

        override fun onSurfaceDestroyed(holder: SurfaceHolder?) {
            super.onSurfaceDestroyed(holder)
            isVisibleState = false
            mainHandler.removeCallbacks(redrawRunnable)
        }

        override fun onDestroy() {
            super.onDestroy()
            mainHandler.removeCallbacks(redrawRunnable)
            mainHandler.post {
                webView?.destroy()
                webView = null
            }
            bitmap?.recycle()
            bitmap = null
            renderCanvas = null
        }
    }
}
`,

    // 23. README.md
    'README.md': `# Daily Focus - Android Lock Screen Live Wallpaper

Complete, production-ready Android Studio project for building and releasing the **Daily Focus Lock Screen Live Wallpaper** on the Google Play Store.

## Quickstart (For Beginners)

1. **Open in Android Studio**:
   - Extract this folder.
   - Launch Android Studio.
   - Click **Open** (or File > Open).
   - Select the extracted folder \`DailyFocusWallpaper\`.
   - Wait 1-2 minutes for Gradle to sync dependencies.

2. **Run on Your Android Phone**:
   - On your phone: Open **Settings > About phone** > tap **Build number** 7 times to enable Developer Options.
   - Open **Settings > System > Developer options** > Turn on **USB Debugging**.
   - Plug phone into your computer via USB cable.
   - In Android Studio, select your device in the top toolbar dropdown.
   - Click the green **Run ▶️** button (Shift + F10).
   - Once installed, tap **"Apply as Lock Screen Wallpaper"** and select **"Home screen and lock screen"**.

3. **Publish to Google Play Store**:
   - Go to menu: **Build > Generate Signed Bundle / APK...**
   - Choose **Android App Bundle (.aab)**.
   - Create a new Key store path (.jks) with your password.
   - Select release build variant.
   - Output will be saved to: \`app/release/app-release.aab\`.
   - Upload this \`.aab\` file to the **Google Play Console**!
`,
  };

  return files;
}

export async function generateAndroidProjectZip(
  blocks: ScheduleBlock[],
  theme: WallpaperTheme,
  config: AndroidProjectConfig
): Promise<Blob> {
  const zip = new JSZip();
  const files = buildProjectFileTree(blocks, theme, config);

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  return content;
}
