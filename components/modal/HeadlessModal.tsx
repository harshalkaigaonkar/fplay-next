import { Dialog, Transition } from '@headlessui/react'
import { Fragment, MouseEventHandler, ReactNode, useState } from 'react'

export default function HeadlessModal({ onClose = (bool: boolean) => {}, isOpen, title, cta, cta_function, cta_disabled = false, children} : {
    onClose?: (bool: boolean) => void ,
    isOpen: boolean,
    title: string,
    cta: string,
    cta_function: MouseEventHandler<HTMLButtonElement>,
    cta_disabled?: boolean,
    children?: ReactNode
}) {

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#232323] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold text-gray-100"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    {!!children && children}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      disabled={cta_disabled}
                      className={` ${cta_disabled && "opacity-50"}
                      w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition duration-300 bg-[#434343] border-none border-[#343434] hover:cursor-pointer hover:bg-[#343434] active:shadow active:bg-[#222222]`}
                      onClick={cta_function}
                    >
                      {cta}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
