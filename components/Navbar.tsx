'use client'

import {
    Disclosure,
    DisclosurePanel,
    DisclosureButton,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Home", href: "/", current: false },
    { name: "Transactions", href: "/transactions", current: false },
    { name: "Savings Goals", href: "/savings", current: false },
    { name: "Budgets", href: "/budgets", current: false },
    { name: "Reports", href: "/report", current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
    const pathname = usePathname();

    const navigationWithCurrent = navigation.map((item) => ({
        ...item,
        current: pathname === item.href,
    }));

    return (
        <Disclosure as="nav" className="bg-gold-3">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-red-500 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon
                                aria-hidden="true"
                                className="block size-6 group-data-open:hidden"
                            />
                            <XMarkIcon
                                aria-hidden="true"
                                className="hidden size-6 group-data-open:block"
                            />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img
                                alt="TheCreativeXchange"
                                src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=black"
                                // width={64}
                                // height={64}
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigationWithCurrent.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        aria-current={
                                            item.current ? "page" : undefined
                                        }
                                        className={classNames(
                                            item.current
                                                ? "bg-black-1 text-white"
                                                : "text-gray-700 hover:bg-yellow-200 hover:text-black-2",
                                            "rounded-md px-3 py-2 text-sm font-bold"
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center">
                        <img
                            alt="TheCreativeXchange"
                            src="/logo.png"
                            className="h-16 w-auto px-2"
                        />
                    </div>

                    <SignedOut>
                        <div className="text-white bg-black-1 px-3 py-2 rounded-md font-bold">
                            <SignInButton />
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>

                <DisclosurePanel className="sm:hidden">
                    <div className="space-y-1 px-2 pt-2 pb-3">
                        {navigationWithCurrent.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                aria-current={item.current ? "page" : undefined}
                                className={classNames(
                                    item.current
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                    "block rounded-md px-3 py-2 text-base font-medium"
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                </DisclosurePanel>
            </div>
        </Disclosure>
    );
};

export default Navbar;
