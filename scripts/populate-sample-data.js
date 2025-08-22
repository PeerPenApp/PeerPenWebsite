const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const sampleEssays = [
  {
    id: 'sample-1',
    author_id: 'user_2abc123',
    title: 'My Journey to Becoming a Computer Scientist',
    content: `From the moment I first typed "Hello, World!" into my computer, I knew I wanted to pursue computer science. The ability to create something from nothing, to solve complex problems with elegant code, fascinated me beyond measure.

Growing up, I was always the kid who would take apart electronics just to see how they worked. My parents' frustration with broken devices was matched only by my curiosity about the inner workings of technology. This curiosity led me to my first programming class in high school, where I discovered that I could not only understand how computers worked, but I could make them do exactly what I wanted.

The turning point came during my junior year when I participated in a hackathon. Working with a team of students, we built an app that helped local farmers track crop yields and predict optimal planting times. Seeing our code come to life and knowing it could make a real difference in people's lives was incredibly rewarding. That experience solidified my decision to pursue computer science as a career.

What excites me most about computer science is its potential to solve real-world problems. Whether it's developing algorithms to improve healthcare outcomes, creating software to address climate change, or building systems that connect people across the globe, computer science offers endless opportunities to make a positive impact.

I'm particularly interested in artificial intelligence and machine learning, fields that are revolutionizing how we approach complex problems. The idea that we can teach machines to learn and adapt, to recognize patterns and make predictions, opens up possibilities that seemed like science fiction just a few decades ago.

My goal is to contribute to this exciting field by developing innovative solutions that address pressing global challenges. I want to be part of a community that pushes the boundaries of what's possible, that creates technology that not only advances human knowledge but also improves human lives.

The computer science program at this university offers exactly the kind of rigorous education and research opportunities I need to achieve these goals. The faculty's expertise in AI and machine learning, combined with the university's commitment to interdisciplinary collaboration, provides the perfect environment for me to grow as a computer scientist and as a person.

I'm ready to dive deep into algorithms, data structures, and computational theory. I'm excited to work on cutting-edge research projects and collaborate with peers who share my passion for technology. Most importantly, I'm eager to learn from professors who are at the forefront of their fields and who can guide me toward making meaningful contributions to the world of computer science.

This journey began with a simple "Hello, World!" program, but it will continue with groundbreaking research, innovative projects, and contributions to a field that has the power to transform our world. I can't wait to see where this path leads.`,
    word_count: 450,
    college: 'MIT',
    prompt: 'Why do you want to study computer science?',
    visibility: 'public',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sample-2',
    author_id: 'user_2def456',
    title: 'The Power of Community Service',
    content: `When I was 12 years old, my family moved to a new city, and I found myself feeling isolated and alone. The transition was difficult, and I struggled to make friends at my new school. It was during this challenging time that I discovered the transformative power of community service.

My mother, always looking for ways to help me adjust, suggested we volunteer at the local food bank. I was hesitant at first, but from the moment I walked through the doors, I felt a sense of belonging that I hadn't experienced since moving. The volunteers welcomed me with open arms, and I quickly learned that helping others was one of the most effective ways to help myself.

What started as a way to pass the time became a passion that has shaped my character and my goals. Over the past six years, I've volunteered over 500 hours at various organizations, from tutoring underprivileged children to organizing community clean-up events. Each experience has taught me valuable lessons about empathy, leadership, and the importance of giving back to society.

One of my most meaningful experiences came when I started a peer tutoring program at my high school. Recognizing that many students struggled with math and science, I organized a group of volunteers to provide free tutoring sessions after school. The program grew from serving 10 students to over 50, and seeing the improvement in their grades and confidence was incredibly rewarding.

Through community service, I've learned that leadership isn't about being in charge—it's about serving others and inspiring them to serve as well. I've discovered that the most effective leaders are those who lead by example, who are willing to do the hard work alongside their team, and who genuinely care about the people they're helping.

My experiences have also taught me about the importance of sustainability in community service. It's not enough to provide temporary solutions; we need to address the root causes of problems and create lasting change. This understanding has influenced my academic interests, leading me to study social policy and community development.

I've also learned that community service is a two-way street. While I've given my time and effort to help others, I've received so much more in return. I've gained confidence, developed leadership skills, and formed lasting friendships. Most importantly, I've found my purpose: to use my education and abilities to make a positive difference in the world.

As I look toward college and beyond, I'm excited to continue my journey of service. I want to study public policy and community development, with the goal of working for organizations that address systemic issues like poverty, education inequality, and environmental justice. I believe that by understanding the root causes of social problems, I can help develop more effective solutions.

My experiences have shown me that change is possible, one person and one community at a time. Whether it's helping a struggling student understand algebra or organizing a neighborhood clean-up, every act of service contributes to building a better world. I'm committed to continuing this work throughout my life, using my education and skills to create positive change in whatever community I find myself in.

The lessons I've learned through community service—about empathy, leadership, and the power of collective action—will guide me as I pursue my education and career. I'm excited to see how I can apply these lessons to new challenges and opportunities, always remembering that the best way to find yourself is to lose yourself in the service of others.`,
    word_count: 520,
    college: 'Stanford',
    prompt: 'Describe a community service experience that has shaped your character.',
    visibility: 'public',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'sample-3',
    author_id: 'user_2ghi789',
    title: 'Overcoming Failure: My Path to Resilience',
    content: `Failure has been my greatest teacher. It's a lesson I learned early and often, starting with my first attempt at learning to play the violin. At age 8, I was convinced I would be a musical prodigy, but reality quickly set in. My fingers wouldn't cooperate, my bow technique was terrible, and my teacher's patience was wearing thin. After six months of struggling, I wanted to quit.

My parents, however, had different ideas. They didn't let me give up, and looking back, I'm grateful for their persistence. They helped me understand that failure wasn't the end of the road—it was just a detour on the path to success. With their encouragement, I kept practicing, kept making mistakes, and slowly, very slowly, I began to improve.

This early experience with failure taught me resilience, a quality that would serve me well in the years to come. When I failed my first math test in high school, I didn't panic. Instead, I analyzed what went wrong, sought help from my teacher, and developed a study strategy that worked for me. When my science fair project didn't work as planned, I used the failure as an opportunity to learn about experimental design and the importance of thorough research.

The most significant failure I've faced came during my junior year when I ran for student body president. I was confident I would win—I had good ideas, I was well-liked, and I had experience in student government. But when the votes were counted, I had lost by a significant margin. The defeat was humbling and painful.

Instead of letting this failure define me, I used it as motivation to improve. I asked the winner for advice, I sought feedback from my peers, and I worked on developing better communication skills. The following year, I ran again, and this time I won. The victory was sweet, but the lessons I learned from the failure were even more valuable.

Through these experiences, I've come to understand that failure is not the opposite of success—it's a stepping stone to success. Every failure teaches us something valuable, whether it's about our own limitations, the importance of preparation, or the need to adapt our approach. The key is to learn from failure rather than be defeated by it.

I've also learned that failure is often necessary for growth. When we succeed at everything we try, we don't develop the resilience and problem-solving skills we need to face life's bigger challenges. Failure forces us to think creatively, to persevere in the face of adversity, and to develop the grit that separates those who achieve their goals from those who give up.

As I prepare for college, I know that I will face new challenges and, inevitably, new failures. But I'm not afraid of them. I've learned to embrace failure as an opportunity for growth, to analyze my mistakes and learn from them, and to use setbacks as motivation to work harder and smarter.

My experiences with failure have also taught me the importance of supporting others when they fail. I've learned to be a good friend and teammate, offering encouragement and help when others are struggling. I understand that everyone faces setbacks, and that a kind word or helping hand can make all the difference.

Looking toward the future, I'm excited to continue learning and growing, knowing that failure will be part of the journey. I'm confident that the resilience I've developed will help me overcome whatever challenges come my way, and that each failure will make me stronger and more capable.

The violin still sits in my room, a reminder of my first major failure and the valuable lessons it taught me. Sometimes I pick it up and play, not because I'm particularly good at it, but because it reminds me of how far I've come and how much I've grown. Failure may have been my greatest teacher, but it's also been one of my greatest gifts.`,
    word_count: 580,
    college: 'Harvard',
    prompt: 'Describe a time when you faced failure and how you overcame it.',
    visibility: 'public',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function populateSampleData() {
  try {
    console.log('Starting to populate sample data...');

    // First, let's create some sample user profiles (without email column)
    const sampleUsers = [
      {
        id: 'user_2abc123',
        username: 'alex_coder',
        display_name: 'Alex Chen',
        bio: 'Passionate about computer science and AI',
        created_at: new Date().toISOString()
      },
      {
        id: 'user_2def456',
        username: 'sarah_service',
        display_name: 'Sarah Johnson',
        bio: 'Community service advocate and leader',
        created_at: new Date().toISOString()
      },
      {
        id: 'user_2ghi789',
        username: 'mike_resilient',
        display_name: 'Mike Rodriguez',
        bio: 'Learning from every failure and setback',
        created_at: new Date().toISOString()
      }
    ];

    // Insert sample users
    for (const user of sampleUsers) {
      try {
        await client.execute({
          sql: `INSERT OR IGNORE INTO profiles (id, username, display_name, bio, created_at) 
                VALUES (?, ?, ?, ?, ?)`,
          args: [user.id, user.username, user.display_name, user.bio, user.created_at]
        });
        console.log(`Inserted user: ${user.display_name}`);
      } catch (error) {
        console.error(`Error inserting user ${user.username}:`, error);
      }
    }

    // Insert sample essays
    for (const essay of sampleEssays) {
      try {
        await client.execute({
          sql: `INSERT OR IGNORE INTO essays (id, author_id, title, content, word_count, college, prompt, visibility, status, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [essay.id, essay.author_id, essay.title, essay.content, essay.word_count, essay.college, essay.prompt, essay.visibility, essay.status, essay.created_at, essay.updated_at]
        });
        console.log(`Inserted essay: ${essay.title}`);
      } catch (error) {
        console.error(`Error inserting essay ${essay.id}:`, error);
      }
    }

    // Add some sample ratings
    const sampleRatings = [
      { essay_id: 'sample-1', rater_id: 'user_2def456', score: 5 },
      { essay_id: 'sample-1', rater_id: 'user_2ghi789', score: 4 },
      { essay_id: 'sample-2', rater_id: 'user_2abc123', score: 5 },
      { essay_id: 'sample-2', rater_id: 'user_2ghi789', score: 5 },
      { essay_id: 'sample-3', rater_id: 'user_2abc123', score: 4 },
      { essay_id: 'sample-3', rater_id: 'user_2def456', score: 5 }
    ];

    for (const rating of sampleRatings) {
      try {
        await client.execute({
          sql: `INSERT OR IGNORE INTO ratings (id, essay_id, rater_id, score, created_at) 
                VALUES (?, ?, ?, ?, ?)`,
          args: [`rating_${rating.essay_id}_${rating.rater_id}`, rating.essay_id, rating.rater_id, rating.score, new Date().toISOString()]
        });
        console.log(`Inserted rating for essay ${rating.essay_id}`);
      } catch (error) {
        console.error(`Error inserting rating:`, error);
      }
    }

    // Add some sample comments
    const sampleComments = [
      { essay_id: 'sample-1', author_id: 'user_2def456', body: 'Great essay! Your passion for computer science really comes through.' },
      { essay_id: 'sample-2', author_id: 'user_2abc123', body: 'Inspiring story about community service. Keep up the great work!' },
      { essay_id: 'sample-3', author_id: 'user_2def456', body: 'Resilience is such an important quality. Thanks for sharing your story.' }
    ];

    for (const comment of sampleComments) {
      try {
        await client.execute({
          sql: `INSERT OR IGNORE INTO comments (id, essay_id, author_id, body, created_at) 
                VALUES (?, ?, ?, ?, ?)`,
          args: [`comment_${comment.essay_id}_${comment.author_id}`, comment.essay_id, comment.author_id, comment.body, new Date().toISOString()]
        });
        console.log(`Inserted comment for essay ${comment.essay_id}`);
      } catch (error) {
        console.error(`Error inserting comment:`, error);
      }
    }

    console.log('Sample data population completed successfully!');
    console.log('You can now test the search and browse functionality with this sample data.');

  } catch (error) {
    console.error('Error populating sample data:', error);
  }
}

// Run the script
populateSampleData();
