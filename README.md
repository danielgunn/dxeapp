# Introduction

This is an ionic application made for the [Direct Action Everywhere](http://www.directactioneverywhere.com) activist community.  It's goal is to facilitate the organization of actions and events done by this group.

# Features
* Chapter events / actions list
* Chapter news
* Change DxE chapter

# Supported platforms
* iOS
* Android
* Browser

#Installation
To install, of course you can install the binary or you can build the source code, or you can see the live version hosted on [secondbull.com](http://secondbull.com/dxe)

## Build Prerequisites
* [Ionic](http://ionicframework.com)
* [Cordova CLI](http://cordova.apache.org/docs/en/3.5.0/guide_cli_index.md.html)
* [PhoneGap Facebook Plugin](https://github.com/Wizcorp/phonegap-facebook-plugin)
* [Whitelist Plugin](https://github.com/apache/cordova-plugin-whitelist)

##Source Code Caveats
Currently, it seems you must add the phonegap-facebook-plugin plugin manually.
See [ios installation guide](https://github.com/Wizcorp/phonegap-facebook-plugin/blob/master/platforms/ios/README.md)

If you did things correctly you should see a file in 'platforms/ios/Direct Action Everywhere/Direct Action Everywhere-Info.plist' containing the facebook ids.
e.g
```sh
platforms/ios$ grep -R 30915 *
Direct Action Everywhere/Direct Action Everywhere-Info.plist:    <string>630915116944951</string>
Direct Action Everywhere/Direct Action Everywhere-Info.plist:          <string>fb630915116944951</string>
```

## Download app/binary

 * [Play Store](https://play.google.com/store/apps/details?id=com.directactioneverywhere.app)
 * [phonegap build](https://build.phonegap.com/apps/962836)
 * Apple store is pending approval
