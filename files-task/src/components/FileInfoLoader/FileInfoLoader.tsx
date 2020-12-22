import { Card } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import styles from './styles.module.css'

interface Props {
  active: boolean
}

const FileInfoLoader = ({ active }: Props) => {
  const animation = active ? 'pulse' : false

  return (
    <Card className={styles.root}>
      <div className={styles.media}>
        <Skeleton className={styles.mediaSkeleton} animation={animation} />
      </div>
      <div className={styles.bottom}>
        <Skeleton width='80%' animation={animation} />
        <Skeleton width='30%' animation={animation} />
        <Skeleton variant='circle' width={24} height={24} className={styles.button} animation={animation} />
      </div>
    </Card>
  )
}

export default FileInfoLoader
