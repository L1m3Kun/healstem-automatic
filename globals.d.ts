declare module "*.css" {
  const styles: { [className: string]: string };
  export default styles;
}

declare namespace React {
  interface CSSProperties {
    // :root variables
    "--background"?: string;
    "--foreground"?: string;

    // @theme inline variables
    "--color-background"?: string;
    "--color-foreground"?: string;
    "--font-sans"?: string;
    "--font-mono"?: string;

    // Color palette
    "--color-bg"?: string;
    "--color-bg-soft"?: string;
    "--color-surface"?: string;
    "--color-primary"?: string;
    "--color-secondary"?: string;
    "--color-accent"?: string;
    "--color-text"?: string;
    "--color-text-muted"?: string;
    "--color-border"?: string;
  }
}
