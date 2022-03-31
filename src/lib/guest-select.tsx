import React, { useEffect } from "react"
import { Popover, Portal } from "@headlessui/react"
import { BookingForm, GuestOption } from "./use-react-booking-form"
import { useSelectPopper } from "./use-select-popper"

export type OptionType = {
  name: string
  value: any
}

export type OffsetType = [number, number]

export type GuestSelectType = {
  form: BookingForm
  name: string
  menu: React.ElementType
  menuContainer: React.ElementType
  option: React.ElementType
  okButton?: React.ElementType
  okText?: string
  inputComponent: React.ElementType<any & { isLoading?: boolean }>
  placeholder?: string
  offset?: OffsetType
}

export const GuestSelect = ({
  form,
  name,
  menu: Menu,
  option: OptionComponent,
  menuContainer: MenuContainer,
  inputComponent: InputComponent,
  okButton: OkButton,
  okText = "Ok",
  placeholder,
  offset,
}: GuestSelectType) => {
  const formStateItem = form?.state?.[name]
  const options = formStateItem.value
  const {
    element,
    setElement,
    setPopper,
    styles,
    attributes,
  } = useSelectPopper({
    offset,
  })

  useEffect(() => {
    //@ts-ignore
    form.refs[name].current = element
  }, [element])

  const onFocus = () => {
    element?.click()
  }

  const count = form.state[name].totalCount

  const val = count ? `${count} guest${count > 1 ? "s" : ""}` : ""

  const onOkButtonClick = () => {
    element?.click()
  }

  return (
    <Popover as={React.Fragment}>
      {({ open }) => (
        <>
          <Popover.Button
            value={val}
            ref={setElement}
            onFocus={onFocus}
            as={InputComponent}
            placeholder={placeholder}
            name={name}
            form={form}
            readOnly
          />
          <Portal>
            <Popover.Panel
              as={MenuContainer}
              ref={setPopper}
              static
              style={{ ...styles.popper, pointerEvents: open ? "" : "none" }}
              {...attributes.popper}
            >
              <Menu open={open}>
                {/* @ts-ignore */}
                {options.map((option: GuestOption) => (
                  <OptionComponent
                    key={option.name}
                    form={form}
                    name={name}
                    option={option}
                  />
                ))}
                {!!OkButton && (
                  <OkButton onClick={onOkButtonClick}>{okText}</OkButton>
                )}
              </Menu>
            </Popover.Panel>
          </Portal>
        </>
      )}
    </Popover>
  )
}
