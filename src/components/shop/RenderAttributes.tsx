import React from 'react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'

const RenderAttributes = ({ product }) => {

    if (!product?.attributes) return null

    return (
        <>
            {Object.entries(product.attributes).map(([attrName, values]: any, index) => {

                switch (attrName) {

                    case "Color":
                        return (
                            <div key={index} className="mb-4">

                                <h3 className="font-medium mb-2">{attrName}</h3>

                                <RadioGroup className="flex gap-3">

                                    {values.map((attrInfo: any) => {

                                        const id = `${attrName}-${attrInfo.id}`

                                        return (
                                            <div key={id} className="flex items-center gap-2">

                                                <RadioGroupItem
                                                    value={attrInfo.id}
                                                    id={id}
                                                    className="hidden"
                                                />

                                                <Label
                                                    htmlFor={id}
                                                    className="w-8 h-8 rounded-full border cursor-pointer"
                                                    style={{
                                                        backgroundColor: attrInfo.meta_info
                                                    }}
                                                />

                                            </div>
                                        )
                                    })}

                                </RadioGroup>

                            </div>
                        )

                    case "Size":
                        return (
                            <div key={index} className="mb-4">

                                <h3 className="font-medium mb-2">{attrName}</h3>

                                <RadioGroup className="flex gap-2">

                                    {values.map((attrInfo: any) => {

                                        const id = `${attrName}-${attrInfo.id}`

                                        return (
                                            <div key={id}>

                                                <RadioGroupItem
                                                    value={attrInfo.id}
                                                    id={id}
                                                    className="hidden"
                                                />

                                                <Label
                                                    htmlFor={id}
                                                    className="border px-3 py-1 rounded cursor-pointer hover:bg-gray-100"
                                                >
                                                    {attrInfo.value}
                                                </Label>

                                            </div>
                                        )
                                    })}

                                </RadioGroup>

                            </div>
                        )

                    default:
                        return (
                            <div key={index}>

                                <h3>{attrName}</h3>

                                {values.map((v:any)=>(
                                    <span key={v.id}>{v.value}</span>
                                ))}

                            </div>
                        )
                }

            })}
        </>
    )
}

export default RenderAttributes