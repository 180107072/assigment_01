import { FC, useEffect, useRef, useState, MouseEvent } from 'react'
import init, { apply_basic_gaussian, apply_flip, apply_invert } from 'rsw-cv'

const loadImage = async (url: string): Promise<string> => {
	const response = await fetch(url)
	const blob = await response.blob()
	const reader = new FileReader()
	return new Promise((resolve) => {
		reader.onloadend = () => reader.result && resolve(reader.result.toString())
		reader.readAsDataURL(blob)
	})
}

type ImageWrapperProps = {
	url: string
	name: string
	onClick: (image: string) => string
}
const ImageWrapper: FC<ImageWrapperProps> = ({ url, name, onClick }) => {
	const filteredRef = useRef<HTMLImageElement>(null)
	const [image, setImage] = useState('')

	const handleApplyFilter = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.currentTarget.disabled = true
		if (!filteredRef.current) return
		filteredRef.current.src = onClick(image)
	}

	useEffect(() => void loadImage(url).then(setImage), [])

	return (
		<div
			className='w-full flex flex-col items-stretch shadow-md bg-zinc-800 rounded-xl overflow-hidden'
			style={{ minHeight: '500px' }}
		>
			<p className='p-2'>{name}</p>
			<div className='overflow-hidden flex flex-col items-stretch w-full h-full'>
				<img src={image} className='flex-1 w-full h-full' />
				<img ref={filteredRef} className='flex-1 w-full h-full' />
			</div>
			<button
				className='p-2 w-full bg-zinc-700 transition hover:underline hover:bg-zinc-900 cursor-pointer'
				onClick={handleApplyFilter}
			>
				Apply Filter
			</button>
		</div>
	)
}

function App() {
	useEffect(() => {
		init()
	}, [])

	const applyGaussian = (image: string) => apply_basic_gaussian(image)
	const applyInvert = (image: string) => apply_invert(image)
	const applyFlip = (image: string) => apply_flip(image)

	return (
		<div className='h-screen grid grid-cols-1 gap-5 md:grid-cols-3 bg-zinc-600 overflow-auto text-gray-200 p-5'>
			<ImageWrapper
				url='https://picsum.photos/1000/1000'
				onClick={applyGaussian}
				name='Gaussian'
			/>
			<ImageWrapper
				name='Invert'
				url='https://picsum.photos/1000/1000'
				onClick={applyInvert}
			/>
			<ImageWrapper
				name='Flip'
				url='https://picsum.photos/1000/1000'
				onClick={applyFlip}
			/>
		</div>
	)
}

export default App
