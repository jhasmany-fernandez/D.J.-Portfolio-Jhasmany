'use client'

import { useState } from 'react'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  currentEmoji?: string
}

const emojiCategories = {
  'Desarrollo': [
    '💻', '🌐', '🖥️', '⌨️', '🖱️', '📱', '💾', '🗄️',
    '⚙️', '🔧', '🛠️', '🔌', '📡', '🚀', '⚡', '🔥'
  ],
  'Lenguajes': [
    '🟨', '🔷', '📘', '⚛️', '🔵', '🟢', '💚', '⚫',
    '🐍', '🐘', '☕', '💎', '🦀', '🟦', '🟧', '🟪'
  ],
  'Diseño': [
    '🎨', '✨', '💅', '🎐', '💨', '🌈', '🎭', '🖌️',
    '✏️', '📐', '📏', '🖍️', '🎯', '💡', '🔮', '⭐'
  ],
  'Base de Datos': [
    '🗄️', '💾', '📊', '📈', '📉', '💿', '💽', '🗃️',
    '📦', '🗂️', '📋', '📁', '📂', '🔐', '🔒', '🔑'
  ],
  'Cloud & DevOps': [
    '☁️', '🌩️', '🌧️', '🚀', '🛸', '🛰️', '⚙️', '🔄',
    '🔁', '♻️', '📤', '📥', '🔗', '⛓️', '🌐', '🗺️'
  ],
  'Testing & QA': [
    '🧪', '✅', '✔️', '❌', '🐛', '🔍', '🔎', '🎯',
    '📝', '📋', '✍️', '🔬', '⚗️', '🧬', '🩺', '💉'
  ],
  'E-commerce': [
    '🛒', '💳', '💰', '💵', '💴', '💶', '💷', '🏪',
    '🏬', '🛍️', '📦', '📮', '📫', '🎁', '🎀', '🏷️'
  ],
  'Comunicación': [
    '💬', '💭', '🗨️', '🗯️', '💌', '📧', '📨', '📩',
    '📬', '📭', '📮', '📯', '📢', '📣', '📡', '🔔'
  ],
  'Seguridad': [
    '🔐', '🔒', '🔓', '🔑', '🗝️', '🛡️', '🔰', '⚠️',
    '🚨', '🚦', '🚥', '⛔', '🔞', '🔱', '⚡', '⚔️'
  ],
  'Otros': [
    '📱', '⏱️', '⏰', '🎯', '🎪', '🎬', '🎮', '🎲',
    '🎰', '🧩', '🎁', '🎉', '🎊', '🎈', '🎆', '🎇'
  ]
}

export default function EmojiPicker({ onSelect, currentEmoji }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Desarrollo')

  const handleSelect = (emoji: string) => {
    onSelect(emoji)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Current Emoji Display & Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-primary text-neutral hover:bg-primary/80 transition-colors duration-200"
        >
          <span className="text-2xl">{currentEmoji || '😀'}</span>
          <span className="text-sm">Elegir Emoji</span>
        </button>
      </div>

      {/* Emoji Picker Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker Panel */}
          <div className="absolute left-0 mt-2 z-50 bg-secondary border border-border rounded-lg shadow-xl p-4 w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral">Selecciona un Emoji</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-tertiary-content hover:text-neutral"
              >
                ✕
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 mb-3 overflow-x-auto pb-2">
              {Object.keys(emojiCategories).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded text-xs whitespace-nowrap transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-accent text-secondary'
                      : 'bg-primary text-tertiary-content hover:bg-primary/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
              {emojiCategories[selectedCategory as keyof typeof emojiCategories].map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(emoji)}
                  className={`text-2xl p-2 rounded hover:bg-primary/50 transition-all duration-200 ${
                    currentEmoji === emoji ? 'bg-accent/20 ring-2 ring-accent' : ''
                  }`}
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>

          </div>
        </>
      )}
    </div>
  )
}
