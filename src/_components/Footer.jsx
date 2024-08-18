const Footer = () => {
  return (
    <div className='flex justify-between md:px-[150px] py-[15px] px-[20px] fixed bottom-0 w-full z-[99999] bg-background'>
      <p className='text-sm text-gray-500'>&copy; {new Date().getFullYear()} ConvertMate. All rights reserved.</p>
    </div>
  )
}

export default Footer
