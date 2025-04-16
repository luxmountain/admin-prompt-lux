export interface IRoute {
    path: string;
    element?: React.ComponentType; // Dùng React.ReactNode thay cho JSX.Element
    protected: boolean;
    label?: string;
    icon?: React.ComponentType; // Thay IconType bằng React.ElementType để hỗ trợ các icon component
    children?: IRoute[]; // Nested routes (optional)
  }