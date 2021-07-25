const Notification = ({ message, isError=false }) => {
    if (message === null) {
        return null
    }

    const className = isError ? "notification error" : "notification"

    return (
        <div className={className}>
            {message}
        </div>
    )
}

export default Notification