export default function Footer() {
    return (
        <div className='bottom-0 left-0 w-full'>
            <footer className='footer footer-horizontal footer-center text-neutral p-4 justify-self-end text-xs'>
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - Omari Stunner</p>
                </aside>
            </footer>
        </div>
    )
}