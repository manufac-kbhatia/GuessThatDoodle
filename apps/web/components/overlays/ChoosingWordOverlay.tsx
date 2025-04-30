import { PlayerInfo } from '@repo/common/types'
import React from 'react'

const ChoosingWordOverlay = ({currentPlayer}: {currentPlayer?: PlayerInfo}) => {
  return (
    <div className="inset-0 absolute bg-neutral-400 space-y-2 p-4 flex flex-col justify-center items-center">
        <div className="text-3xl font-bold">{currentPlayer?.name} is choosing a word</div>
    </div>
  )
}

export default ChoosingWordOverlay