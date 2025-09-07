import styles from './skeleton.module.css'

export default function Skeleton({height}:{height:string}) {
  return (
    <div style={{height:`${height}`}} className={styles.skeletonLoader}>
    <div className={styles.shimmer}></div>
  </div>  )
}
