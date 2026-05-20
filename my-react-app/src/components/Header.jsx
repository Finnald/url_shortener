
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/react'

function Header() {
    return (
        <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
            {/* Logo / Title */}
            <h1 className="text-lg font-semibold text-gray-800">
                smollink
            </h1>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
                <Show when="signed-out">
                    <SignInButton mode="modal">
                        <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-sm">
                            Sign In
                        </button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                        <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition text-sm">
                            Sign Up
                        </button>
                    </SignUpButton>
                </Show>

                <Show when="signed-in">
                    <UserButton afterSignOutUrl="/" />
                </Show>
            </div>
        </header>
    );
}

export default Header;