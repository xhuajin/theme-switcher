import { List, ActionPanel, Action, showToast, Toast, Icon } from "@raycast/api";
import { exec, execSync } from "child_process";
import { useCallback, useEffect, useState } from "react";

type Theme = "Light" | "Dark" | "Unknown";

// 获取当前主题
function getCurrentTheme(): Theme {
    try {
        const output = execSync(
            'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme',
            { encoding: "utf8" },
        );

        // 示例输出中包含：
        // AppsUseLightTheme    REG_DWORD    0x1
        const match = output.match(/AppsUseLightTheme\s+REG_DWORD\s+0x(\d)/i);
        if (!match) return "Unknown";

        return match[1] === "1" ? "Light" : "Dark";
    } catch {
        return "Unknown";
    }
}

// 切换主题
function setTheme(theme: "Light" | "Dark") {
    const value = theme === "Light" ? 1 : 0;
    const regCmd = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d ${value} /f`;

    return new Promise<void>((resolve, reject) => {
        exec(regCmd, (err) => {
            if (err) {
                showToast({
                    style: Toast.Style.Failure,
                    title: "切换主题失败",
                    message: err.message,
                });
                reject(err);
                return;
            }
            // 更新系统主题
            exec("rundll32.exe user32.dll,UpdatePerUserSystemParameters", (updateErr) => {
                if (updateErr) {
                    showToast({
                        style: Toast.Style.Failure,
                        title: "更新主题显示失败",
                        message: updateErr.message,
                    });
                    reject(updateErr);
                    return;
                }
                showToast({
                    style: Toast.Style.Success,
                    title: `主题已切换到 ${theme === "Light" ? "浅色" : "深色"} 模式`,
                });
                resolve();
            });
        });
    });
}

export default function Command() {
    const [current, setCurrent] = useState<Theme>("Unknown");
    const [isLoading, setIsLoading] = useState(true);

    const refreshTheme = useCallback(() => {
        setCurrent(getCurrentTheme());
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshTheme();
    }, [refreshTheme]);

    const handleSwitch = useCallback(
        async (theme: "Light" | "Dark") => {
            setIsLoading(true);
            try {
                await setTheme(theme);
            } finally {
                refreshTheme();
            }
        },
        [refreshTheme],
    );

    return (
        <List isLoading={isLoading} searchBarPlaceholder="选择要应用的主题">
            <List.Item
                icon={Icon.Sunrise}
                title={`${current === "Light" ? "已是" : "切换到"} 浅色 模式`}
                subtitle={current === "Unknown" ? "当前主题未知" : `当前主题：${current}`}
                accessories={[{ text: current === "Light" ? "当前" : "可切换" }]}
                actions={
                    <ActionPanel>
                        <Action
                            title={`切换到浅色模式`}
                            onAction={() => handleSwitch("Light")}
                            // shortcut={{ modifiers: ["ctrl"], key: "l" }}
                        />
                    </ActionPanel>
                }
            />
            <List.Item
                icon={Icon.Moonrise}
                title={`${current === "Dark" ? "已是" : "切换到"} 深色 模式`}
                subtitle={current === "Unknown" ? "当前主题未知" : `当前主题：${current}`}
                accessories={[{ text: current === "Dark" ? "当前" : "可切换" }]}
                actions={
                    <ActionPanel>
                        <Action
                            title={`切换到深色模式`}
                            onAction={() => handleSwitch("Dark")}
                            // shortcut={{ modifiers: ["ctrl"], key: "d" }}
                        />
                    </ActionPanel>
                }
            />
        </List>
    );
}
