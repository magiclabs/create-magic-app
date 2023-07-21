import classNames from 'classnames'
import Link from 'next/link'

const DevLinks = ({primary = false}: {primary?: boolean}) => (
  <div className='flex flex-row mb-4'>
    <Link
      href='https://magic.link/docs'
      className={classNames(
        'font-medium underline mx-4 cursor-pointer',
        primary ? 'text-blue-700' : 'text-white'
      )}>
			Docs
    </Link>
    <div className={primary ? 'text-blue-700' : 'text-white'}>|</div>
    <Link
      href='https://dashboard.magic.link/signup'
      className={classNames(
        'font-medium underline mx-4 cursor-pointer',
        primary ? 'text-blue-700' : 'text-white'
      )}>
			Dashboard
    </Link>
    <div className={primary ? 'text-blue-700' : 'text-white'}>|</div>
    <Link
      href='https://discord.com/invite/magiclabs'
      className={classNames(
        'font-medium underline mx-4 cursor-pointer',
        primary ? 'text-blue-700' : 'text-white'
      )}>
			Discord
    </Link>
  </div>
)

export default DevLinks
