import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Link } from 'react-router-dom';
import { HomeIcon, BellIcon, GlobeIcon } from '@radix-ui/react-icons';

const Navbar = () => {
    return (
        
        <NavigationMenu.Root className="relative flex justify-center w-screen z-[1] mt-5 p-5">
            <NavigationMenu.List className="flex justify-center gap-x-15 bg-white px-4 py-2 rounded-md  list-none">
                <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                        <Link
                            to="/dash"
                            className="inline-flex items-center justify-center px-4 py-2 font-medium text-[15px] leading-none text-gray-400 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 transition-colors"
                        >
                            <HomeIcon className="block sm:hidden w-6 h-6" />
                            <span className="hidden sm:inline">Dash</span>
                        </Link>
                    </NavigationMenu.Link>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                        <Link
                            to="/location-search"
                            className="inline-flex items-center justify-center px-4 py-2 font-medium text-[15px] leading-none text-gray-400 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 transition-colors"
                        >
                            <GlobeIcon className="block sm:hidden w-6 h-6" />
                            <span className="hidden sm:inline">Location Search</span>
                        </Link>
                    </NavigationMenu.Link>
                </NavigationMenu.Item>

                <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                        <Link
                            to="/alerts"
                            className="inline-flex items-center justify-center px-4 py-2 font-medium text-[15px] leading-none text-gray-400 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 transition-colors"
                        >
                            <BellIcon className="block sm:hidden w-6 h-6" />
                            <span className="hidden sm:inline">Alerts</span>
                        </Link>
                    </NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu.Root>
    );
};


export default Navbar;