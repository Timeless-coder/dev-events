'use client'

import { useState, FormEvent } from 'react'

const BookEvent = () => {
	const [email, setEmail] = useState("")
	const [submitted, setSubmitted] = useState(false)

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		setTimeout(() => {
			setSubmitted(true)
		}, 1000)
	}

	return (
		<div id='book-event'>
			{submitted
				? <p className='text-sm'>Thank you for signing up!</p>
				: (
					<form onSubmit={handleSubmit}>
						<div>
							<label htmlFor="email">Email</label>
							<input id='email' type="email" value={email} onChange={e => setEmail(e.target.value)}
								placeholder='Enter your email address' />
						</div>
						<button type='submit' className='button-submit'>Submit</button>
					</form>
				)
			}
		</div>
	)
}

export default BookEvent