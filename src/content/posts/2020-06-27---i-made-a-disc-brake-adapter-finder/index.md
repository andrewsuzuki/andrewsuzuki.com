---
title: I Made a Disc Brake Adapter Finder
date: "2020-06-27T21:00:00.000Z"
description: I think almost every bike mechanic has accidentally ordered the wrong disc brake adapter at one time or another.
tags:
  - bike-wrench
  - cycling
  - software
draft: false
---

I think almost every bike mechanic has accidentally ordered the wrong disc brake adapter at one time or another. I decided to make a simple online wizard to make it easy. Simply enter your frame/fork mount standard, caliper standard, and rotor size. It should return a list of possible adapters, or adapter combinations if necessary.

<BigButtonLink hasRightArrow to="/disc-brake-adapter-finder" title="Disc Brake Adapter Finder">Go to adapter finder</BigButtonLink>

## Resources

For a fairly comprehensive overview and technical drawings of disc brake mounting systems, check out [this post](http://www.peterverdone.com/disc-brake-mounting-systems/) by Peter Verdone.

## Implementation

Pretty straightforward [React](https://reactjs.org/) app. The only interesting part is how it chooses a stack of adapters when two are needed. I represented all known adapters as edges of a [directed graph](https://en.wikipedia.org/wiki/Directed_graph), then used a [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) (DFS) to find all paths between the frame/fork mount and virtual caliper mount.
