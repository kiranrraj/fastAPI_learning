import { AppShellState } from "./appShellState.types"

import { defaultHeaderState } from "@/app/context/slices/headerState"
import { defaultFooterState } from "@/app/context/slices/footerState"
import { defaultUserState } from "@/app/context/slices/userState"
import { defaultNotificationState } from "../context/slices/notificationState"

export const defaultAppShellState: AppShellState = {
    header: defaultHeaderState,
    footer: defaultFooterState,
    userState: defaultUserState,
    notification: defaultNotificationState,
    //   sidebar: defaultSidebarState,
    //   contentArea: defaultContentAreaState,
}
