import Link from "next/link"

interface FooterProps {
  texts: {
    tagline: string
    sections: {
      product: {
        title: string
        links: string[]
      }
      company: {
        title: string
        links: string[]
      }
      legal: {
        title: string
        links: string[]
      }
    }
    copyright: string
  }
}

export function Footer({ texts }: FooterProps) {
  return (
    <footer className="py-12 sm:py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="ri-robot-line text-white text-lg"></i>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">STAFF AI</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              {texts.tagline}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm sm:text-base">{texts.sections.product.title}</h3>
            <ul className="space-y-2 text-gray-400">
              {texts.sections.product.links.map((link, index) => (
                <li key={index}>
                  <Link href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm sm:text-base">{texts.sections.company.title}</h3>
            <ul className="space-y-2 text-gray-400">
              {texts.sections.company.links.map((link, index) => (
                <li key={index}>
                  <Link href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm sm:text-base">{texts.sections.legal.title}</h3>
            <ul className="space-y-2 text-gray-400">
              {texts.sections.legal.links.map((link, index) => (
                <li key={index}>
                  <Link href="#" className="text-sm sm:text-base hover:text-white transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p className="text-sm sm:text-base">{texts.copyright}</p>
        </div>
      </div>
    </footer>
  )
}