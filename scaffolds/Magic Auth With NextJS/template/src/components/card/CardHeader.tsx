import ActionButton, {ActionProps} from './ActionButton'
type HeaderProps = {
	title: string
	action?: ActionProps
}

const CardHeader = ({title, action}: HeaderProps) => (
	<div className='flex items-center'>
		<div className='flex-1 text-md font-semibold text-black'>{title}</div>
		{action && (
			<ActionButton
				title={action.title}
				type={action.type}
				loading={action.loading}
				onClick={action.onClick}
			/>
		)}
	</div>
)

export default CardHeader
