import { HeaderState } from "@/app/types/header/header.types"
import { FooterState } from "@/app/types/footer/footer.types"
import { UserState } from "@/app/types/user/user.types"
import { NotificationState } from "./notification/notification.types"
// import { SidebarState } from "@/app/types/sidebar/sidebar.types"
// import { ContentAreaState } from "@/app/types/content/contentArea.types"

export interface AppShellState {
    header: HeaderState
    footer: FooterState
    userState: UserState
    notification: NotificationState
    // contentArea: ContentAreaState
    // sidebar: SidebarState
}
