import Image from 'next/image'
import MagicColorWhite from 'public/magic_color_white.svg'
import { Dispatch, SetStateAction } from 'react'
import DevLinks from './DevLinks'

const Header = () => {
  return (
    <div className="w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] min-h-[30vh] flex flex-col items-center bg-magic">
      <Image
        className="h-[180] w-[120px] m-2"
        src={MagicColorWhite}
        alt="logo"
      />
      <DevLinks />
    </div>
  )
}

export default Header
