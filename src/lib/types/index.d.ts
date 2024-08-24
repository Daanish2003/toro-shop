type AuthCard = {
    children? : React.ReactNode;
    cardTitle: String;
    cardDescription?: String;
    cardFooter: String;
    cardFooterLink: Url;
}

type ApiResponse = {
    success?: string | null;
    error?: string | null;
}