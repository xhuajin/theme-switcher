# Theme Switcher

A Raycast extension for quickly switching Windows app theme between Light and Dark mode.

---

## Features

- Toggle Windows app theme (Light / Dark)
- Display current theme status
- No admin privileges required
- Instant system update

---

## How It Works

The extension modifies the following Windows registry key:

```
HKCU\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize
```

Specifically:

- `AppsUseLightTheme = 1` → Light mode
- `AppsUseLightTheme = 0` → Dark mode

After updating the registry, the system theme is refreshed via:

```
rundll32.exe user32.dll,UpdatePerUserSystemParameters
```

---

## Usage

1. Open Raycast
2. Run **Toggle Windows Apps Theme**
3. Select to switch to Light or Dark mode

---

## Requirements

- Windows 10 or later
- Raycast for Windows

---

## Notes

- This extension only affects **app theme**, not the system-wide theme.
- Changes take effect immediately.
- No background process or persistent service is used.

---

## License

MIT