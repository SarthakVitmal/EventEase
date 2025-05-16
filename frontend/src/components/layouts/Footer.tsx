export default function Footer() {
  return (
    <footer className="mx-auto container w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
          © 2025 EventEase. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}