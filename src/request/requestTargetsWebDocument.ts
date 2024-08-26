export function requestTargetsWebDocument(url: URL): boolean {
    // All web documents are targeted by requests with a query component
    return url.searchParams.size !== 0;
}
