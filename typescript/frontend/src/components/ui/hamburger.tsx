import Button, { ButtonProps } from '@/components/ui/button';
interface HamburgerProps extends ButtonProps {
  isOpen?: boolean;
}

export default function Hamburger({ isOpen, ...props }: HamburgerProps) {
  return (
    <Button aria-label="Hamburger" shape="circle" {...props}>
      <svg
        className="sm:w-auo h-auto w-6"
        width="30"
        height="30"
        viewBox="0 0 100 100"
      >
        <path
          className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] transition-[stroke-dasharray,stroke-dashoffset] duration-[600ms]"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={isOpen ? '90 207' : '60 207'}
          strokeDashoffset={isOpen ? '-134' : '0'}
          d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
        ></path>
        <path
          className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] transition-[stroke-dasharray,stroke-dashoffset] duration-[600ms]"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={isOpen ? '1 60' : '60 60'}
          strokeDashoffset={isOpen ? '-30' : '0'}
          d="M 20,50 H 80"
        ></path>
        <path
          className="ease-[cubic-bezier(0.4, 0, 0.2, 1)] transition-[stroke-dasharray,stroke-dashoffset] duration-[600ms]"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={isOpen ? '90 207' : '60 207'}
          strokeDashoffset={isOpen ? '-134' : '0'}
          d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
        ></path>
      </svg>
    </Button>
  );
}
