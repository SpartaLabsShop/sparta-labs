"use client";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[#2a1f1f] bg-[#1B1212] pt-20 text-[#cccccc] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-16 px-8 max-[768px]:px-4 max-[480px]:px-3">
        {/* Top Footer */}
        <div className="flex flex-wrap justify-between gap-10">
          {/* Brand Column */}
          <div className="flex max-w-[320px] min-w-[250px] flex-1 flex-col">
            <a
              href="/"
              className="mb-4 flex items-center gap-3 font-['Neue_Haas_Grotesk_Display',sans-serif] text-[1.5rem] font-medium tracking-[0.1em] text-ink no-underline"
            >
              <svg viewBox="0 0 190 300" width="28" height="36" className="text-ink">
                <path
                  d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z"
                  fill="currentColor"
                />
              </svg>
              SPARTA LABS
            </a>
            <p className="mb-6 text-[0.85rem] leading-[1.6] text-[#555555]">
              Produced and verified to controlled standards. Each batch undergoes rigorous testing protocols to
              ensure maximum purity.
            </p>
            <a
              href="mailto:support@spartapeptides.com"
              className="mb-6 text-[0.9rem] font-semibold text-ink no-underline hover:underline"
            >
              support@spartapeptides.com
            </a>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="text-ink transition-colors duration-200 hover:text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-ink transition-colors duration-200 hover:text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex min-w-[300px] flex-[2] gap-[60px] max-[1024px]:order-2 max-[1024px]:flex-[100%] max-[1024px]:justify-between max-[768px]:flex-wrap max-[768px]:gap-10">
            <div className="flex flex-col max-[768px]:min-w-[140px]">
              <h4 className="mb-5 text-[0.95rem] font-semibold text-ink">Shop</h4>
              <ul className="m-0 flex flex-col gap-3 p-0 list-none">
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">All Products</a></li>
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Research Focus</a></li>
              </ul>
            </div>

            <div className="flex flex-col max-[768px]:min-w-[140px]">
              <h4 className="mb-5 text-[0.95rem] font-semibold text-ink">Information</h4>
              <ul className="m-0 flex flex-col gap-3 p-0 list-none">
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">About</a></li>
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Quality & Standards</a></li>
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">FAQ</a></li>
              </ul>
            </div>

            <div className="flex flex-col max-[768px]:min-w-[140px]">
              <h4 className="mb-5 text-[0.95rem] font-semibold text-ink">Support</h4>
              <ul className="m-0 flex flex-col gap-3 p-0 list-none">
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Contact</a></li>
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Shipping & Returns</a></li>
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Terms & Conditions</a></li>
              </ul>
              <h4 className="mt-6 mb-5 text-[0.95rem] font-semibold text-ink">Account</h4>
              <ul className="m-0 flex flex-col gap-3 p-0 list-none">
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Login</a></li>
                <li><a href="#" className="text-[0.85rem] text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Order Status</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="min-w-[280px] max-w-[380px] flex-[1.2] max-[1024px]:order-3 max-[1024px]:max-w-full max-[1024px]:flex-[100%]">
            <h4 className="mb-5 flex items-center gap-2 text-[0.95rem] font-semibold text-ink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Stay Informed
            </h4>
            <p className="mb-6 text-[0.85rem] leading-[1.6] text-[#555555]">
              Receive updates on new releases, documentation, and research developments as they become available.
            </p>
            <form className="flex gap-2 max-[480px]:flex-col" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 rounded border border-[#dcdcdc] bg-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-ink"
              />
              <button
                type="submit"
                className="rounded bg-ink px-6 py-2.5 text-[0.85rem] font-medium text-white transition-colors duration-200 hover:bg-[#333333] max-[480px]:w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Middle Disclaimer */}
        <div className="flex gap-4 pb-12 text-[0.75rem] leading-[1.6] text-[#777777]">
          <div className="mt-0.5 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <p>
            All products sold by Sparta are intended exclusively for in vitro research, laboratory testing, and
            non-clinical research applications. Products are not intended for human or veterinary use. Products are
            not FDA-approved drugs. Sparta is a research chemical supplier, not a 503A or 503B compounding facility.
            No product is intended to diagnose, treat, cure, mitigate, or prevent any disease. These chemicals are
            not intended to be drugs, medications, or pharmaceutical preparations as defined by 21 U.S.C. § 321.
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-line py-6">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-5 px-8 max-[768px]:flex-col max-[768px]:text-center max-[768px]:px-4 max-[480px]:px-3">
          <p className="m-0 text-[0.8rem] text-[#777777]">© Sparta. All rights reserved.</p>
          <div className="flex gap-6 max-[768px]:flex-wrap max-[768px]:justify-center max-[768px]:gap-4">
            <a href="#" className="text-[0.85rem] font-medium text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Privacy Policy</a>
            <a href="#" className="text-[0.85rem] font-medium text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Shipping Policy</a>
            <a href="#" className="text-[0.85rem] font-medium text-[#555555] no-underline transition-colors duration-200 hover:text-ink">Terms & Conditions</a>
          </div>
          <button
            className="flex items-center gap-2 rounded border border-[#dcdcdc] bg-transparent px-4 py-2 text-[0.85rem] font-medium text-ink transition-all duration-200 hover:border-ink hover:bg-hover"
            onClick={scrollToTop}
          >
            Back to top
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </button>
        </div>
      </div>

      <div className="pointer-events-none mt-8 flex h-[25vw] w-full justify-center overflow-hidden">
        <span className="sticky bottom-0 translate-y-[15%] font-['Neue_Haas_Grotesk_Display',sans-serif] text-[25vw] leading-[0.7] font-semibold tracking-[-0.02em] text-[#222222] uppercase">
          SPARTA
        </span>
      </div>
    </footer>
  );
};

export default Footer;
