export interface SignInPageProps {
    onSignIn: (role: string) => void;
    addToast: (message: string) => void;
}