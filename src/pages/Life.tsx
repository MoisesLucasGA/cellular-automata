import { Button } from '@/components/ui/button'
import { useRef, useState, type Ref } from 'react'
import p5 from 'p5'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

/**
 * R U L E S
 *
 * 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
 * 2. Any live cell with two or three live neighbours lives on to the next generation.
 * 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
 * 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

const preload = (
  canvasX: number,
  canvasY: number,
  setMyP5: React.Dispatch<React.SetStateAction<p5 | undefined>>,
  ref: React.RefObject<HTMLDivElement | null>,
  size: number = 20,
) => {
  const s = (sketch: any) => {
    let cells: number[][] = []
    let total = Math.floor((canvasX * 0.8) / size)
    let totalY = Math.floor((canvasY * 0.8) / size)

    let play = false

    sketch.setup = () => {
      sketch.createCanvas(total * size, totalY * size)
      sketch.background(0)
      sketch.frameRate(15)

      for (let i = 0; i < totalY; i++) {
        const row: number[] = []
        for (let j = 0; j < total; j++) {
          row.push(0)
        }
        cells.push(row)
      }
    }

    const checkNeighbors = (row: number, col: number): number => {
      const directions: [number, number][] = [
        [-1, 0], // Up
        [1, 0], // Down
        [0, -1], // Left
        [0, 1], // Right
        [-1, -1], // Top-left
        [-1, 1], // Top-right
        [1, -1], // Bottom-left
        [1, 1], // Bottom-right
      ]

      let count = 0

      for (const [dr, dc] of directions) {
        // If current cell is on the "egde" of the matrix, it loops around
        let newRow = row + dr >= cells.length ? 0 : row + dr
        let newCol = col + dc >= cells[0].length ? 0 : col + dc

        if (row + dr < 0) {
          newRow = cells.length - 1
        }
        if (col + dc < 0) {
          newCol = cells[0].length - 1
        }

        if (cells[newRow][newCol] === 1) {
          count++
        }
      }

      return count
    }

    const nextGen = (): number[][] => {
      const aux = cells.map((x) => x.map((e) => e))

      for (let i = 0; i < totalY; i++) {
        for (let j = 0; j < total; j++) {
          const numberOfNeighbors = checkNeighbors(i, j)

          // Rule #1
          if (cells[i][j] === 1 && numberOfNeighbors < 2) {
            aux[i][j] = 0
          }
          // Rule #3
          else if (cells[i][j] === 1 && numberOfNeighbors > 3) {
            aux[i][j] = 0
          }
          // Rule #4
          else if (cells[i][j] === 0 && numberOfNeighbors === 3) {
            aux[i][j] = 1
          }
        }
      }

      return aux
    }

    sketch.mouseClicked = () => {
      const x = sketch.int(sketch.mouseX)
      const y = sketch.int(sketch.mouseY)

      if (x > canvasX * 0.8 || x <= 0) {
        return
      }
      if (y > canvasY * 0.8 || y <= 0) {
        return
      }

      const coordX = (x - (x % size)) / size
      const coordY = (y - (y % size)) / size

      cells[coordY][coordX] = cells[coordY][coordX] === 0 ? 1 : 0
    }

    sketch.keyPressed = () => {
      if (sketch.key == ' ') {
        play = !play
      }
    }

    sketch.draw = () => {
      if (play) {
        cells = nextGen()
      }

      for (let i = 0; i < totalY; i++) {
        for (let j = 0; j < total; j++) {
          cells[i][j] === 1 ? sketch.fill(255) : sketch.fill(60)
          sketch.square(j * size, i * size, size)
        }
      }
    }
  }

  const my = new p5(s, ref.current!)
  setMyP5(my)
}

export const Life = () => {
  const [myP5, setMyP5] = useState<p5>()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col p-1  bg-[#1e1e20]">
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-3xl text-white">Conway's Game of Life</h2>
        <h3 className="font-bold text-1xl text-gray-400">
          Jogo da Vida de Conway
        </h3>

        <div className="flex flex-row gap-4 p-2">
          <p className="text-white max-w-80 text-center">
            Draw by clicking on the squares, then press SPACE to watch it
            evolves.
          </p>
          <p className="text-white max-w-80 text-center">
            Desenhe clicando nos quadrados, depois pressione ESPAÇO para ver
            evoluindo.
          </p>
        </div>
        <div className="flex flex-row gap-4 justify-center p-4">
          <Button
            onClick={() => {
              myP5?.remove()
              preload(window.innerWidth, window.innerHeight, setMyP5, ref)
            }}
          >
            Draw
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => {
              myP5?.remove()
            }}
          >
            Delete
          </Button>
          <Dialog>
              <DialogTrigger asChild>
                <Button>Info</Button>
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="sm:max-w-[600px] bg-neutral-800">
                <DialogHeader className='text-white'>
                  <DialogTitle className='text-2xl'>Rules/Regras</DialogTitle>
                  <DialogDescription>
                    The evolution of the cells follow these rules: <br/> A evolução das células segue as seguintes regras:
                  </DialogDescription>
                </DialogHeader>
                  <div className='flex flex-row gap-2'>

                  <ul className='flex flex-col gap-2 text-white'>
                    <li>1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>  
                    <li>2. Any live cell with two or three live neighbours lives on to the next generation.</li>  
                    <li>3. Any live cell with more than three live neighbours dies, as if by overpopulation.</li>  
                    <li>4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>  
                  </ul> 
                  <ul className='flex flex-col gap-2 text-white'>
                    <li>1. Qualquer célula viva com menos de dois vizinhos vivos morre, como se fosse por subpopulação.</li>  
                    <li>2. Qualquer célula viva com dois ou três vizinhos vivos vive para a próxima geração.</li>  
                    <li>3. Qualquer célula viva com mais de três vizinhos vivos morre, como se fosse por superpopulação.</li>  
                    <li>4. Qualquer célula morta com exatamente três vizinhos vivos se torna uma célula viva, como se fosse por reprodução.</li>  
                  </ul>  
                  </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Ok</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="m-auto" ref={ref as Ref<HTMLDivElement>} />
    </div>
  )
}
