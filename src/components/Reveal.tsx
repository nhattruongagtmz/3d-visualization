import { motion, useReducedMotion } from 'motion/react'

interface Props {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function Reveal({ children, delay = 0, className }: Props) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
