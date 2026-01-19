import p5 from 'p5'
import { useRef, useState, type Ref } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

const check = (a: number, b: number, c: number, variant: string): number => {
  const v = variant.split('')

  if (a == 0 && b == 0 && c == 0) return Number(v[7])
  if (a == 0 && b == 0 && c == 1) return Number(v[6])
  if (a == 0 && b == 1 && c == 0) return Number(v[5])
  if (a == 0 && b == 1 && c == 1) return Number(v[4])
  if (a == 1 && b == 0 && c == 0) return Number(v[3])
  if (a == 1 && b == 0 && c == 1) return Number(v[2])
  if (a == 1 && b == 1 && c == 0) return Number(v[1])
  if (a == 1 && b == 1 && c == 1) return Number(v[0])

  return 0
}

const nextGen = (current: number[], variant: string): number[] => {
  let newGen: number[] = []

  for (let index = 0; index < current.length; index++) {
    let left = index === 0 ? current[current.length - 1] : current[index - 1]
    let middle = current[index]
    let right = current[(index + 1) % current.length]

    newGen[index] = check(left, middle, right, variant)
  }

  return newGen
}

const preload = (
  canvasX: number,
  canvasY: number,
  variant: string,
  size: number,
  setMyP5: React.Dispatch<React.SetStateAction<p5 | undefined>>,
  ref: React.RefObject<HTMLDivElement | null>,
) => {
  const s = (sketch: any) => {
    let cells: number[] = []
    let total = Math.floor((canvasX * 0.8) / size)

    let y = 0

    const canvasHeight = canvasY * 0.8 - ((canvasY * 0.8) % size)

    sketch.setup = () => {
      sketch.createCanvas(total * size, canvasHeight)
      sketch.background(0)
      for (let i = 0; i < total; i++) {
        cells[i] = 0
      }
      cells[Math.floor(total / 2)] = 1
    }

    sketch.draw = () => {
      if (y > canvasHeight) sketch.noLoop()

      for (let index = 0; index < cells.length; index++) {
        cells[index] === 1 ? sketch.fill(60) : sketch.fill(255)
        sketch.square(index * size, y, size)
      }
      y += size

      cells = nextGen(cells, variant)
    }
  }
  const my = new p5(s, ref.current!)
  setMyP5(my)
}

export const Automata1D = () => {
  const size = 20
  const [myP5, setMyP5] = useState<p5>()
  const [variant, setVariant] = useState<string>('')

  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="flex gap-2 items-end justify-center flex-wrap mb-4">
        <div className="flex flex-col gap-2 items-start">
          <label className="font-bold text-white" htmlFor="variant">
            Variant
          </label>
          <Input
            className="text-white"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              Number(value) < 256 ? setVariant(value) : null
            }}
            maxLength={3}
            value={variant}
            placeholder="Between 0 and 255"
            inputMode="numeric"
          />
        </div>
        <Button
          variant={'destructive'}
          onClick={() => {
            myP5?.remove()
          }}
        >
          Remove
        </Button>
        <Button
          variant={'secondary'}
          onClick={() => {
            myP5?.remove()
            const v = Number(variant).toString(2).padStart(8, '0')
            preload(
              window.innerWidth,
              window.innerHeight,
              v,
              size,
              setMyP5,
              ref,
            )
          }}
          disabled={variant == ''}
        >
          Draw
        </Button>
      </div>
      <div ref={ref as Ref<HTMLDivElement>} />
    </div>
  )
}
