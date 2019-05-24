---
title: "Demo"
date: 2019-05-24
menu:
    main:
        weight: 9
toc: true
jumbotronImage:
    url: https://images.unsplash.com/photo-1558629669-f95eab4c9587?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=913&q=80
    source: Unsplash
    offset: 40%
    comment: Image description text
---

## Heading without image
<div style="width: 98vw; position: relative; left: 50%; right: 50%; margin-left: -49vw; margin-right: -49vw;">
    <div class="c-jumbotron o-outer-container">
        <h1>Anlässe</h1>
    </div>
</div>

# Headings

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Formatting

**Bold text** _italic text_ ~~strike through~~ **bold and _italic_**

[I'm an inline-style link](https://www.google.com)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque enim erat, interdum vel faucibus quis, tempor ac nibh. Morbi et nisl ac justo volutpat vehicula eget vitae metus. Phasellus in ex nec lorem blandit euismod. Maecenas convallis ipsum a libero semper sodales. Mauris velit felis, imperdiet sit amet eros vel, efficitur eleifend risus.

Mauris sodales nunc vel turpis laoreet elementum. Ut posuere vel quam sollicitudin bibendum. Integer non pretium elit. Sed lectus augue, venenatis sagittis mi id, consequat posuere neque. Mauris dui mi, fringilla sed neque vel, porttitor facilisis mauris. In semper turpis sed ipsum blandit pretium. Aliquam sollicitudin ipsum sem, quis pulvinar lectus aliquam aliquet. Nulla tortor dui, imperdiet at vehicula et, fringilla nec elit. Suspendisse eget ante ut risus porta facilisis ut ac ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ornare nibh vitae tempor auctor.

## Lists

1. List
2. List
3. List
4. List

* List
* List
* List
* List

1. First ordered list item
2. Level 1
    * Level 2
        * Level 3
            * Level 4
                * Level 5
1. Actual numbers don't matter, just that it's a number
    1. Level 2
        1. Level 3
            1. Level 4
                1. Level 5
        2. Level 3
4. And another item.

    You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

    To have a line break without a paragraph, you will need to use two trailing spaces.
    Note that this line is separate, but within the same paragraph.
    (This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

## Images

![alt text](https://images.unsplash.com/photo-1558492281-325a7bb4eee6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80 "Logo Title Text 1")
![alt text](https://images.unsplash.com/photo-1558603510-cf83e66d31e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1525&q=80 "Logo Title Text 1")
![alt text](https://cdn.dribbble.com/users/100013/screenshots/424432/dribbb.jpg "Logo Title Text 1")

## Code/Syntax

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

```python
s = "Python syntax highlighting"
print s
```

```
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```

## Tables

| Tables                | Are                     | Cool    |
| ------------- |:-------------:| -----:|
| col 3 is            | right-aligned | $1600 |
| col 2 is            | centered            |     $12 |
| zebra stripes | are neat            |        $1 |

## Quotes

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.

## Dividers

Three or more...

---
el turpis laoreet elementum. Ut posuere vel quam sollicitudin bibendum. Integer non pretium elit. Sed lectus augue, venenatis sagittis mi id, consequat posuere neque. Mauris dui mi, fringilla sed neque vel, porttitor facilisis mauris. In semper turpis sed ipsum blandit preti
***
el turpis laoreet elementum. Ut posuere vel quam sollicitudin bibendum. Integer non pretium elit. Sed lectus augue, venenatis sagittis mi id, consequat posuere neque. Mauris dui mi, fringilla sed neque vel, porttitor facilisis mauris. In semper turpis sed ipsum blandit preti
___

## Map

{{< map >}}

## Forms

### Newsletter

{{< newsletter >}}

### Contact form

{{< form >}}
  {{< input name="name" label="Name *" type="text" placeholder="Name" >}}
  {{< input name="email" label="E-Mail *" type="email" placeholder="E-Mail">}}
{{< /form >}}

## Minitron

{{< minitron url="https://cdna.artstation.com/p/assets/images/images/017/669/990/large/gene-raz-von-edler-cataclysm-by-ellysiumn-hd-as.jpg" source="Artstation" offset="30%" >}}

With Heading:

{{< minitron url="https://cdna.artstation.com/p/assets/images/images/017/669/990/large/gene-raz-von-edler-cataclysm-by-ellysiumn-hd-as.jpg" source="Artstation" offset="30%" >}}

## Minitron with Heading 2

## Gallery

{{< gallery >}}