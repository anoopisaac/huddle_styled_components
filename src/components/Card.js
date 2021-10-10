import { StyledCard } from './styles/Card.styled'
import { Grid } from './styles/Grid.styled'


export default function Card({ item: { id, title, body, image } }) {
  return (
    <StyledCard layout={id % 2 === 0 && 'row-reverse'}>
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <Grid className="hello" gtr="200px 100px">
        <div>ewrer</div>
        <div>333</div>
      </Grid>
      <div>
        <img src={`./images/${image}`} alt='' />
      </div>
    </StyledCard>
  )
}
