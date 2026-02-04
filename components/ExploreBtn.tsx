'use client'

import Image from "next/image"

//	The point of this button is that anything clickable needs a client component. We can use this inside a server component.

const ExploreBtn = () => {
	return (
		<button type="button" id='explore-btn' onClick={() => console.log('clicked')} className="mt-7 mx-auto">
			<a href="#events">
				Explore Events
				<Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
			</a>
		</button>
	)
}

export default ExploreBtn