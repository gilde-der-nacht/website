---
layout: default
locale: en
---

{% Box type="special", link="/", linkLabel="go back to the German website" %}
Looking for the German version?
{% endBox %}

# Welcome

The **Gilde der Nacht** organizes game meetups where **board game lovers, roleplayer and tabletop enthusiasts** are welcome. To make sure you don't miss anything, we recommend that you subscribe to our [newsletter](/newsletter) (German).

## Calendar

In the following section you find our upcoming events. The events are not translated to English. If you wish to know more about those, feel free to [contact us](#contact).

{% EventFilters events=(calendar.items), language="en" %}

{% EventList events=(calendar.items) %}

## Contact

As only some parts of our website have been translated, there is a good chance you'll have some questions. Don't hesitate to contact us:

{% ContactForm uid="02522b6176808d38d02d70bd158b212e6772e3f542ab7ab19523cb5ab235d21a", language="en" %}
