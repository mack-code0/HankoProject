interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
    size?: number
}
export default function Spinner({ className, color, size, ...restProps }: SpinnerProps) {
    const spinnerClasses = `inline-block h-5 w-5 ml-3 animate-spin rounded-full border-4 border-solid  ${color ? `border-[${color}]` : "border-current"} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`;
    return <span
        className={spinnerClasses}
        role="status"
        {...restProps}>
    </span>
}