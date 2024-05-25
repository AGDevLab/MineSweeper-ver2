showModal()

function showModal() {
  document
    .querySelector('.image-container')
    .addEventListener('click', function () {
      this.classList.toggle('clicked')
      var spanElement = this.querySelector('span')

      // Toggle display of span element
      if (this.classList.contains('clicked')) {
        spanElement.style.display = 'inline-block'
      } else {
        spanElement.style.display = 'none'
      }

      console.log(spanElement)
      console.log('hello')
    })
}
