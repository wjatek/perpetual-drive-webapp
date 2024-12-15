import Post from '@/app/components/wall/Post'
import { Box } from '@mui/material'

export default function WallPage() {
  return (
    <Box>
      <Post
        avatar=""
        username="John Doe"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos inventore reiciendis sapiente! Assumenda animi sunt, asperiores praesentium at consectetur id cum exercitationem omnis ea commodi, fuga ipsa magnam pariatur laudantium sed atque dolore quod doloribus, autem facilis ab? Necessitatibus dolore sapiente beatae repellat, excepturi quae."
        createdAt={new Date('2024-12-23T10:30:00')}
        likes={123}
        comments={23}
      />
      <Post
        avatar=""
        username="Anthony Wilson"
        content="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa porro distinctio quam?"
        createdAt={new Date('2024-12-21T10:30:00')}
        likes={0}
        comments={3}
      />
      <Post
        avatar=""
        username="Jeff Roger Johnson"
        content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit ullam voluptate repellendus iste dolorum tempora. Voluptatum vitae veniam magnam, architecto eveniet ullam rem labore error veritatis, sapiente provident exercitationem, nam totam. Iure iusto odio rerum tempora neque, exercitationem ratione hic deleniti corporis temporibus minus doloremque blanditiis nulla sed autem quae delectus! Consequuntur, animi provident quam debitis explicabo dolorem nam ex atque blanditiis minus consequatur deleniti quibusdam a. Modi placeat numquam impedit nobis neque, reiciendis, natus sequi tenetur quos, vero magnam a quas ipsa provident aliquam consequatur qui maxime. Perspiciatis consectetur pariatur accusamus doloribus et eos aliquam saepe quas quidem molestiae."
        createdAt={new Date('2024-11-10T10:30:00')}
        likes={2}
        comments={1}
      />
    </Box>
  )
}
