import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "group relative inline-flex line-clamp-1 backdrop-blur-sm items-center justify-center whitespace-nowrap transition-all duration-500 hover:opacity-95 active:scale-[0.97] rounded-lg text-sm font-medium ring-offset-background transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-white bg-radial-[at_50%_75%] from-amber-700/10 via-amber-500/10 to-amber-300/10 hover:from-amber-700/20 hover:via-amber-500/20 hover:to-amber-300/20",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-8 text-base",
        xl: "h-12 px-10 text-base",
        "2xl": "h-14 px-12 text-base",
      },
      loading: {
        true: "cursor-not-allowed opacity-60",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  },
);

export { buttonVariants };
