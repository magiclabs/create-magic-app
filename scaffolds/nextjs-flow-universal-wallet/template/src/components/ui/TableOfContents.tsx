import React, {useCallback, useEffect, useRef, useState} from 'react'

function useHeadingObserver() {
	const observer = useRef()
	const [activeId, setActiveId] = useState('')

	useEffect(() => {
		const handleObserver = (entries: any) => {
			entries.forEach((entry: any) => {
				if (entry?.isIntersecting) {
					setActiveId(entry.target.id)
				}
			})
		}
		;(observer as any).current = new IntersectionObserver(handleObserver, {
			rootMargin: '0px 0px -82% 0px',
		})
		const elements = document.querySelectorAll('h1')
		elements.forEach((elem) => (observer as any).current.observe(elem))
		// eslint-disable-next-line react-hooks/exhaustive-deps
		return () => (observer.current as any).disconnect()
	}, [])
	return {activeId}
}

const TableOfContents = () => {
	const [isBottomOfPage, setIsBottomOfPage] = useState(false)
	const [headings, setHeadings] = useState<any>([])
	const {activeId} = useHeadingObserver()

	const handleScroll = useCallback(() => {
		const bottom =
			Math.ceil(window.innerHeight + window.scrollY) >=
			document.documentElement.scrollHeight
		setIsBottomOfPage(bottom)
	}, [])

	useEffect(() => {
		const elements = Array.from(document.querySelectorAll('h1')).map(
			(elem) => ({
				id: elem.id,
				text: elem.innerText,
				level: Number(elem.nodeName.charAt(1)),
			})
		)
		setHeadings(elements)

		window.addEventListener('scroll', handleScroll, {
			passive: true,
		})
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll])

	return (
		<nav className='table-of-contents'>
			<ul>
				{headings.map((heading: any) => (
					<li
						key={heading.id}
						className={
							isBottomOfPage && heading.id === 'signing'
								? 'active'
								: activeId === heading.id && !isBottomOfPage
								? 'active'
								: ''
						}>
						<a
							href={`#${heading.id}`}
							onClick={(e) => {
								e.preventDefault()
								;(
									document.querySelector(
										`#${heading.id}`
									) as any
								).scrollIntoView({
									behavior: 'smooth',
								})
							}}>
							{heading.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default TableOfContents
