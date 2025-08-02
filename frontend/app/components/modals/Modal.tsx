'use client';

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaShoppingCart, FaShieldAlt, FaClock, FaUsers } from "react-icons/fa";

import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  isAuthModal?: boolean; // New prop to identify auth modals
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  body, 
  actionLabel, 
  footer, 
  disabled,
  secondaryAction,
  secondaryActionLabel,
  isAuthModal = false
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
  
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300)
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  // Split-screen layout for auth modals
  if (isAuthModal) {
    return (
      <>
        <div
          className="
            justify-center 
            items-center 
            flex 
            overflow-x-hidden 
            overflow-y-auto 
            fixed 
            inset-0 
            z-50 
            outline-none 
            focus:outline-none
            bg-black/70
            backdrop-blur-sm
            p-2
          "
        >
          <div className="
            relative 
            w-full
            h-full 
            flex
            items-center
            justify-center
          ">
            <div className={`
              translate
              duration-300
              w-full
              max-w-5xl
              h-auto
              max-h-[90vh]
              flex
              items-center
              justify-center
              ${showModal ? 'translate-y-0' : 'translate-y-full'}
              ${showModal ? 'opacity-100' : 'opacity-0'}
            `}>
              <div className="
                translate
                w-full
                border-0 
                rounded-3xl 
                shadow-2xl
                relative 
                flex 
                flex-row
                bg-white 
                outline-none 
                focus:outline-none
                overflow-hidden
                min-h-[650px]
                max-h-[90vh]
              ">
                {/* Left Side - RentCart Information */}
                <div className="
                  hidden
                  lg:flex
                  lg:w-1/2
                  bg-gradient-to-br from-orange-500 to-orange-600
                  flex-col
                  justify-center
                  items-center
                  text-white
                  p-8
                  relative
                  overflow-hidden
                ">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-12 left-12 w-32 h-32 bg-white rounded-full"></div>
                    <div className="absolute bottom-20 right-12 w-24 h-24 bg-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
                    <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center max-w-sm">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <FaShoppingCart size={36} className="text-white" />
                      <h1 className="text-3xl font-bold">RentCart</h1>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-4">
                      Welcome to the Future of Renting
                    </h2>
                    
                    <p className="text-sm mb-6 leading-relaxed opacity-90">
                      Join thousands of users who trust RentCart for their rental needs. 
                      Quality items, instant booking, and secure transactions.
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <FaShieldAlt size={18} className="text-orange-200" />
                        <span className="text-left text-sm">100% Verified Items & Secure Payments</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaClock size={18} className="text-orange-200" />
                        <span className="text-left text-sm">24/7 Instant Booking Available</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaUsers size={18} className="text-orange-200" />
                        <span className="text-left text-sm">Trusted Community of Renters</span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">10K+</div>
                        <div className="text-xs opacity-80">Happy Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">50K+</div>
                        <div className="text-xs opacity-80">Items Rented</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">99%</div>
                        <div className="text-xs opacity-80">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="
                  w-full
                  lg:w-1/2
                  flex
                  flex-col
                  justify-center
                  p-6
                  lg:p-8
                  relative
                  max-h-full
                  overflow-y-auto
                ">
                  {/* Close Button */}
                  <button
                    className="
                      p-3
                      border-0 
                      hover:bg-gray-100
                      hover:rounded-full
                      transition-all
                      duration-200
                      absolute
                      top-6
                      right-6
                      text-gray-600
                      hover:text-gray-900
                      z-50
                      bg-white
                      rounded-full
                      shadow-lg
                      hover:shadow-xl
                    "
                    onClick={handleClose}
                    aria-label="Close modal"
                  >
                    <IoMdClose size={24} />
                  </button>

                  {/* Mobile Logo */}
                  <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                    <FaShoppingCart size={28} className="text-orange-500" />
                    <h1 className="text-xl font-bold text-gray-900">RentCart</h1>
                  </div>

                  {/* Form Content */}
                  <div className="flex-1 flex flex-col justify-center min-h-0">
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">
                        Welcome back! Please enter your details.
                      </p>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {title}
                      </h2>
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-h-0">
                      {body}
                    </div>

                    {/* Footer */}
                    <div className="mt-6">
                      {(actionLabel && actionLabel.trim() !== '') && (
                        <div 
                          className="
                            flex 
                            flex-row 
                            items-center 
                            gap-3 
                            w-full
                            mb-4
                          "
                        >
                          {secondaryAction && secondaryActionLabel && (
                            <Button 
                              disabled={disabled} 
                              label={secondaryActionLabel} 
                              onClick={handleSecondaryAction}
                              outline
                            />  
                          )}
                          <Button 
                            disabled={disabled} 
                            label={actionLabel} 
                            onClick={handleSubmit}
                          />
                        </div>
                      )}
                      {footer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Regular modal layout for non-auth modals
  return (
    <>
      <div
        className="
          justify-center 
          items-center 
          flex 
          overflow-x-hidden 
          overflow-y-auto 
          fixed 
          inset-0 
          z-50 
          outline-none 
          focus:outline-none
          bg-black/70
          backdrop-blur-sm
          p-4
        "
      >
        <div className="
          relative 
          w-full
          max-w-3xl
          mx-auto 
          h-auto
          flex
          items-center
          justify-center
          my-4
        ">
          {/*content*/}
          <div className={`
            translate
            duration-300
            w-full
            h-auto
            flex
            items-center
            justify-center
            ${showModal ? 'translate-y-0' : 'translate-y-full'}
            ${showModal ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="
              translate
              w-full
              border-0 
              rounded-2xl 
              shadow-2xl
              relative 
              flex 
              flex-col 
              bg-white 
              outline-none 
              focus:outline-none
              overflow-hidden
              max-h-[75vh]
            ">
              {/*header*/}
              <div className="
                flex 
                items-center 
                p-4
                rounded-t-2xl
                justify-center
                relative
                border-b-2
                border-gray-200
                bg-gradient-to-r from-orange-50 to-orange-100
              ">
                <button
                  className="
                    p-2
                    border-0 
                    hover:bg-gray-200
                    hover:rounded-lg
                    transition-all
                    duration-200
                    absolute
                    left-4
                    text-gray-600
                    hover:text-gray-900
                  "
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-bold text-gray-900">
                  {title}
                </div>
              </div>
              {/*body*/}
              <div className="relative p-4 flex-auto overflow-y-auto max-h-[55vh]">
                {body}
              </div>
              {/*footer*/}
              <div className="flex flex-col gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-b-2xl border-t border-gray-200">
                {(actionLabel && actionLabel.trim() !== '') && (
                  <div 
                    className="
                      flex 
                      flex-row 
                      items-center 
                      gap-3 
                      w-full
                    "
                  >
                    {secondaryAction && secondaryActionLabel && (
                      <Button 
                        disabled={disabled} 
                        label={secondaryActionLabel} 
                        onClick={handleSecondaryAction}
                        outline
                      />  
                    )}
                    <Button 
                      disabled={disabled} 
                      label={actionLabel} 
                      onClick={handleSubmit}
                    />
                  </div>
                )}
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
