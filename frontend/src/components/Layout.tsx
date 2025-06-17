import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../store/slices/authSlice";

const navigation = [
  { name: "Home", href: "/", public: true },
  { name: "Join Game", href: "/join", public: true },
  { name: "My Quizzes", href: "/my-quizzes", public: false },
  { name: "Create Quiz", href: "/create-quiz", public: false },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-primary-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link to="/" className="text-white text-xl font-bold">
                      QuizMaster
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) =>
                        item.public || isAuthenticated ? (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="text-white hover:bg-primary-500 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            {item.name}
                          </Link>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {isAuthenticated ? (
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-primary-600 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
                            <span className="sr-only">Open user menu</span>
                            <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
                              {user?.username.charAt(0).toUpperCase()}
                            </div>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                >
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <div className="space-x-4">
                        <Link
                          to="/login"
                          className="text-white hover:bg-primary-500 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="bg-white text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-primary-600 p-2 text-primary-200 hover:bg-primary-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {navigation.map((item) =>
                  item.public || isAuthenticated ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-white hover:bg-primary-500 block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item.name}
                    </Link>
                  ) : null
                )}
              </div>
              <div className="border-t border-primary-700 pt-4 pb-3">
                {isAuthenticated ? (
                  <div className="flex items-center px-5">
                    <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {user?.username}
                      </div>
                      <div className="text-sm font-medium text-primary-300">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 px-2">
                    <Link
                      to="/login"
                      className="text-white hover:bg-primary-500 block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-white text-primary-600 hover:bg-primary-50 block px-3 py-2 rounded-md text-base font-medium"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
