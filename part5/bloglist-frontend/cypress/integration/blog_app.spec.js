describe('Blog App', function(){
  beforeEach(function(){
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const initialUser = {
      username:'harry',
      name:'Harry',
      password: 'sekret'
    }
    cy.createUser(initialUser)
  })

  it('login form is shown', function(){
    cy.contains('username:')
    cy.contains('password:')
    cy.contains('log in')
  })

  describe('Login', function(){
    it('succeeds with currect credentials', function(){
      cy.get('#username').type('harry')
      cy.get('#password').type('sekret')
      cy.get('#loginButton').click()

      cy.contains('Harry logged in')
    })

    it('fails with wrong credentials', function(){
      cy.get('#username').type('harry')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('when logged in', function(){
    beforeEach(function(){
      cy.login({ username:'harry', password: 'sekret' })
    })

    it('a blog can be created', function(){
      cy.contains('create new blog').click()
      cy.get('#title').type('First class tests')
      cy.get('#author').type('Robert C. Martin')
      cy.get('#url').type('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll')
      cy.get('#submitBlogButton').click()
      cy.contains('First class testsbyRobert C. Martin')
    })

    describe('and a blog exists', function(){
      beforeEach(function(){
        cy.createBlog({
          title: 'First class tests',
          author: 'Robert C. Martin',
          url:'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
        })
      })

      it('blogs can be liked', function(){
        cy.get('.viewButton').click()
        cy.get('.likeButton').click()
        cy.get('.likeInfo').should('not.contain', 'likes 0')
        cy.get('.likeInfo').should('contain', 'likes 1')
      })

      it('a blog can be deleted by it\'s creator', function(){
        cy.get('.viewButton').click()
        cy.get('.deleteButton').click()
        cy.get('.blog').should('not.exist')
      })

      it('a blog cannot be deleted by anyone other than the creator', function(){
        cy.get('.logoutButton').click()
        const newUser = {
          username: 'ron',
          name: 'Ron',
          password: 'salainen'
        }
        cy.createUser(newUser)
        cy.login({
          username: newUser.username,
          password: newUser.password
        })
        cy.get('.viewButton').click()
        cy.get('.deleteButton').should('not.exist')
        cy.get('.blogDetail').should('not.contain', 'remove')
      })

      describe('and multiple blogs exist', function(){

        beforeEach(function(){
          cy.createBlog({
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7
          })
          cy.createBlog({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5
          })
        })

        it('blogs are ordered according to likes', function(){
          cy.get('.blog').then(blogs => {
            cy.wrap(blogs[0]).should('contain', 'React patterns')
            cy.wrap(blogs[1]).should('contain', 'Go To Statement Considered Harmful')
            cy.wrap(blogs[2]).should('contain', 'First class tests')
          })
        })
      })
    })
  })
})