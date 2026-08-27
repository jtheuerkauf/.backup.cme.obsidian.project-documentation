Transcript. Use arrow keys to navigate between transcript entries.

AI-generated content may be incorrect

**[Bob Charron started transcription]**

#### Sean McCarthy

-- an individual to be able to claim it from the tool initially or the person who is doing it or should they also be able to be assigned to an individual.

#### Bob Charron

It's a good question. So I, and I didn't articulate the first part of what you just said at all, and they should have. So we want people to be able to possibly search for projects that weren't automatically brought in based on predetermined criteria, like construction value and when the close date is and that sort of thing, right?

#### Sean McCarthy

Yeah.

#### Bob Charron

We want them to be able to possibly go in and mine for opportunities inside the data warehouse and find projects that they may want to work on that make sense that we may not have brought in. So for example, you might have a new account manager who's got two projects assigned to them and they're hungry for business and there's some projects that are below the dollar threshold.

Value and then like, look, I'm happy to go after this $15 million build central project because I want some business and I think it could be an opportunity for me that that kind of situation.

#### Sean McCarthy

That makes a lot of sense. So what I would like to at least begin to define before, because again, we'll show you sort of where we're at now, understanding the core conceptual thing. We can absolutely and easily automate.

The creation of these projects coming through, we're already ingesting the build central data, and it really will be just understanding what the rule sets are that defines a auto-created one. Now, we don't currently from one's initial MVP of this.

there was no sort of underpinnings of some of that. So if we do have that already understood in like a document or any sort of discussion, we can get that added in and that sort of ingestion process done, you know, immediately, whatever you guys really want to do with this. And that's sort of what this meeting was about to understand kind of the bounds, because as we got done.

working on it, it became clear of like, well, I see the concept of a tool here, but I needed to understand what the full sort of implications are. And so I think we're kind of now getting to that. Do we already have those rules defined of like, is it $100 million and it gets defined as this type of project, those sorts of things?

#### Bob Charron

I've got 10 more minutes of screen time that I need to finish before I send some updated criteria to Ryan, which he's going to perfect and make it part of the SOP. But we've had long-standing rules in place or guidelines in place for healthcare construction projects.

#### Sean McCarthy

Okay.

#### Bob Charron

inside of Build Central, which comes from their medical construction data tab there. But then they also have construction wire data, which is non-medical, which you're going to start utilizing. We're paying an extra $12,000 a year now for the construction wire data, which includes prisons, it includes labs, biotech, pharma. So the lab team's going to be going after those projects and some of the healthcare account managers and government account managers are going after the prison opportunities.

and you do well with prisons, believe it or not. So, yeah.

So I kind of feel like to kind of replicate what Ryan's doing in a somewhat automated way, we need sort of like a holding tank based on those filters, right? But then give the account managers there in some place they could go to to mine for projects that are outside of those parameters. And I'm not sure yet if we want to put any limitations on that. I haven't really thought that through yet. Like, do we really want them to bring everything they can possibly bring in? Because then we want to.

#### Sean McCarthy

Yeah, and we...

#### Bob Charron

have this potentially massive amount of projects in there. That's something I think we need to think through. But those two general concepts are going to be important.

#### Sean McCarthy

And I mean, there must be some mechanism, and I'm fairly ignorant when it comes to Salesforce design. There must be some mechanism to bucket those in sales. I mean, so we could even, if there's a parameter that we're commonly, you know, sorting by, you know, in that list, I mean, we might be able to do something along those lines where.

#### Sean McCarthy

Even the things that we automatically create, or the things that are mined get bucketed differently, so they sort to not cause clutter for, you know, the general team, but again, I...

Sean McCarthy 4 minutes 21 seconds

Ryan, you and I can talk about that, you know, with Joe as we're sort of queuing up the more automated side of this. We can work through those details, obviously.

#### Ryan Furtado

Yeah, absolutely.

#### Bob Charron

I didn't. Did I did I send you the update yet, Ryan, or or my? I think maybe I did. I don't know. It's been so much going on. I look at my my to-do list.

#### Ryan Furtado

I do remember an e-mail from Friday that you sent me.

#### Bob Charron

And maybe it was Friday. This is pre me updating it. So this is the sort of the SOP for filtering and how we bring things in. Essentially, we bring two different sets of projects in. We have a group of 25 to $100 million projects with various facility type filters and stages. Make that bigger, sorry.

And then those are closing in two years or less, meaning their construction end date is less than two years. And then the second batch is 100 million plus, the bigger projects going out four years, otherwise with the same filters and facility types and stages.

#### Sean McCarthy

Okay. I mean, I think we're definitely set up to replicate this quickly and easily as far as automatic creation. When you said, though, you wanted them to go into a holding tank, just to talk through the concept, there are some of these I have to assume you just want.

Sean McCarthy

5 minutes 27 seconds5:27

Sean McCarthy 5 minutes 27 seconds

Okay. I mean, I think we're definitely set up to replicate this quickly and easily as far as automatic creation. When you said, though, you wanted them to go into a holding tank, just to talk through the concept, there are some of these I have to assume you just want.

Hands off, we just automate and roll in as projects that know, so everything is needs to be okayed by a user.

#### Bob Charron

I don't think so, because there, I think somebody needs to...

That's what we're doing now, Ryan, correct? Everything has to be okay. And I think that's wise, because the problem is, as of today, the accounts are not mapped, so to speak. I've had this conversation with Juan, and the struggle is that Build Central doesn't have a data point.

that matches what we have in Salesforce, right? We've been talking about it and we think the data point is the street address, which we don't have in Salesforce yet, but I think that's phase three.

#### Sean McCarthy

And I think we can begin mapping that out. I know that there's some other things going on behind the scenes where we have, we're going to have need to unify some of the data from A out to Salesforce and do some other things. So I think we can probably start talking about that in correlation with what we're talking about here, but.

#### Bob Charron

Great.

#### Sean McCarthy

That is the heart of the tool that Joe is going to show is that that sort of mapping side of it. We're trying to get it an easy way to map to Build Central Project to Salesforce, either link it to a project and then we'll be adding in the creation of that.

Project as well.

#### Bob Charron

But yeah, once we had that matching data point, anything can come in right directly without having anybody to look at it, and there's just the leftovers that we couldn't match.

#### Sean McCarthy

Oh, so is that a mechanism that if we do map the Salesforce, if this tool is used to map projects over, oh, dang, that's what we were talking about. So Build Central does.

#### Bob Charron

This is it. I think this is the data point that we need to use to map because there's nothing else available. Apparently they don't, they don't, this isn't a healthcare system, but they don't have like DHC, defended healthcare data. They don't map it the way DHC does.

#### Sean McCarthy

Not to get in too much of the nuts and bolts. Right.

Yeah, and --

They do not. And in fact, what we found was they don't even have a consistent mapping for the same company with multiple projects. Those company IDs and the return data are also different, which is

#### Bob Charron

But I believe the address is the same though, right? The location, right?

#### Sean McCarthy

Well, the address is the same and yes, that's right, but pairing against addresses is somewhat of a dangerous gamble occasionally. So it is something and we can absolutely suggest mappings as we ingest them as well, you know, and so it would be easy to just do a one button click of like,

Yes, that is the one, but...

You know that.

#### Bob Charron

It would be an initial matching project, right? That was what it would take initially, and then over time we could finish mapping things out.

**[cross talk]**

#### Joe Theuerkauf

Yeah, we could, we could match him up when we find a direct match, and then anything that's fuzzy, we can, you have to kind of pick and pair up.

#### Bob Charron

The benefit to doing this long term, and though it's not as directly correlated, is we'd like to have at some point in Salesforce the ability to look at all of the projects for each account in Salesforce, not just for the, well, we explain this, in Salesforce, the way I've seen it so far, and I'm no guru on this, but.

You know, we've got accounts in Salesforce that...

You've got like a parent account and we have child accounts, right? Nobody's really been paying too much attention to that in terms of how we associate projects. So we've got projects associated to the parent account and then also to the children account, when in fact, based on my research in ChatGPT, really there should be a parent account, which is the IDN, which is not a physical location.

#### Bob Charron

and then there should be facility accounts that fall under that parent account, that IDN. So all the activity should be on the facilities, not on the parent, and everything should roll up to the parent. We're just not anywhere close to that yet, but that's the long-term goal. If that impacts anything that you're doing now, I just wanted to bring that up.

#### Sean McCarthy

I mean, it's good to be aware because we're constantly trying to figure out the mapping there. And so if we are changing the general structure and we're now building tools to try to feed that data in, we should probably, yeah, I guess sort of begin understanding about where we're headed, not necessarily where we're at.

Because we want to build towards, you know, where we're headed as much as we can.

#### Bob Charron

Yeah, we don't have to unwind something that you just built to get it to the next step.

#### Sean McCarthy

Right, right. So no, that's good to know. So, okay, so with the document that you just showed, I think we have some initial work that we can go ahead and redefine some of the tool set just out of the gate. But to walk that all the way through, just so we're on the same page.

There is no automatic ingestion. It goes to a place to be reviewed that'll have basically a single button click that.

I do we want to force those to be pre-mapped or will the mapping be a part of that approval process?

#### Bob Charron

I think Ryan typically pre-maps them and then gets confirmation, right? That's what we'll do today. So there'll be some rules in place if this is a government, or I should say public, all public, we tend to get mapped to my team, to the government team. So it would be assigned to me.

And then, Brian, you should speak now because you know how you map it and I talk, so, and I know you try to map you try to map up the names of the accounts and try to get some sort of level of correlation there, but how do you do it?

#### Ryan Furtado

Yeah, generally I try to match the best I can based off of the either the owner name or tenant name based on Build Central to an account in Salesforce where there's a pretty confident match. I'll assign the Salesforce ID.

If there's no match or there's a situation where there's multiple child locations, I leave that blank, and when I give the file over to the originals, I...

Or kind of bucket them based on, well, I...

select the account manager based on the zip code of the project. So I try to match by that. And then depending on the account manager, it breaks out into the original managers. So they can go in and sort the file to what falls under their territory.

And they can go in.

#### Sean McCarthy

We now should have better territory data, so we should be able to automate at least some of that side of it as well. So that's good.

#### Bob Charron

So Brian, when you say you try to match up the names of the accounts to the build central name, like is that just a completely manual process or are you using technology to do that?

#### Ryan Furtado

Not sure if you remember Shannon Hilkinson from years back, she was the originator of bringing all these in, and she had built out this Excel that map names and IDs, and I built a Power BI report that basically pulls all these data points together and just kind of matches whatever it can based off that data.

#### Sean McCarthy

Okay, so I mean there might be a way that we can shortcut some of our suggested things with what you're doing. Like if you walk us through what that looks like against the Power BI, we might be able to align that a little better with immediate suggestions. And then you can okay those. So what I'm hearing though, and just to make sure I'm sort of following along.

Ryan, we need to build you an interface initially to do the mapping as well as anyone else that we designate, obviously. Then that mapping, once that gets mapped, it then gets essentially pre-bucketed into the different either directors or individual account managers to.

then verify that they do want a project to be created in Salesforce. And then during that point, do those projects need to be assigned to the individual?

#### Bob Charron

AM, yeah.

#### Sean McCarthy

To, yeah, and so, OK, so then...

#### Bob Charron

So this is a director process, by the way, for sure, not like account managers not going in there and saying, that one's mine. It's a quarterly director review and we collaborate and because if there's any like gray areas, we kind of go back and forth and figure it out. That's what we do now.

#### Sean McCarthy

Okay. Right. Okay.

Okay, so that view is a directors only and then just talking it out fully.

will want as this process rolls and these associations are already done, we can then move them eventually if once we have a high degree of confidence that they have been mapped correctly, we move them out. Ryan no longer has to do anything and they just show up in the director's buckets in order to create those projects.

And then we'll want a third view, which is the AM mining view of underneath a certain outside of those those thresholds.

#### Bob Charron

Which, which I think any any any accounts outside of the filter parameters that the this the RSDs are tasked to review, yeah, but we definitely want to limit it, we don't want them dipping into the same bucket, 'cause then then we're gonna have problems with people taking things they shouldn't be taking.

#### Sean McCarthy

Okay.

So do those need to then be also bubbled up to the directors in a different view to okay? Or can they just be grabbed within some parameters that we define, like they can't grab more than $20 million in six months or however you want to, I don't.

#### Bob Charron

I don't.

I have some ideas of my own, but I don't want to make that decision by myself. I have a meeting with Keith on Friday, so I'll bounce it off in him and get his opinion. Caroline, what are your thoughts?

#### Caroline Hitchcock

I was going to say, I'm not really sure. I'd be interested to see what Keith kind of has to think about it, but I definitely agree that the regional directors need to have the authority to parse out the projects. It could get messy.

#### Bob Charron

Yeah, my thought is we might want to put some restrictions on Sean because like a new account manager may not know what they don't know in terms of like burying themselves with meaningless projects. Maybe they select somebody who goes for approval to their RSD or something like that.

**[cross talk]**

#### Bob Charron

Just take it out loud, but I'll run it by Keith, see what he thinks.

#### Sean McCarthy

Okay, we can begin stubbing in that screen. We don't have to, like, there's just being completely transparent, there is more to this project than I initially thought or anticipated, which is great because it sounds like it will facilitate a lot of good.

you know, work. So we can, what I'd like to do is after this meeting, I work with Joe to sort of outline like, here's sort of step one, here's step two, and then begin knocking some of these things back. You know, what we have is a good underpinning and we can interact with the Build Central API. We have all that data, we can get it out. So.

We have everything we need technically as far as the interactions and data points. Now we just need to understand what the process needs to be. And there's a lot of process that we just laid out. We have tools that are already doing a lot of this stuff, the SIT portal, you know, we have all of the underpinnings to do sort of director approval and.

So there's some work that's already done. So I'm not saying this is a mountain of work. This is more than I walked into this meeting expecting, just to be clear about that. But I think we can make good headway. And I think that the, now it makes sense. Like I was, this was the missing piece to understand what we were doing there.

**[cross  talk]**

You know, I know Joe already knows this, but I kept being like, I'm just really interested to see what you guys are actually going to be using this for, because it seems like a lot of really great data. But what we were doing and what we initially have just felt incomplete, and it is. That's good.

#### Bob Charron

We appreciate you starting the process. A couple of the quick things. One is there are going to be projects that are going to come in from Build Central, and you may already be thinking this way, but there are no Salesforce accounts for you. Like, we're going to have to have that ability. There's a bunch that come in for at least, especially for state and local government entities and prisons are just not regular customers, but there are projects we want to pursue. So that's definitely going to be part of it.

That is also thinking, and again, you're probably already thinking this, but I know Ryan does the things the way he's doing it now, but being where we're at with ChatGPT and AI, I wonder if that matching process would be a good use case for AI or...

#### Sean McCarthy

Yeah, so we, it's funny that you bring it up. We actually have currently a vendor address matching AI agent that we've employed in one of our tool sets that is not in the water yet. We can do something similar to narrow suggestions.

about the data that we currently have. I have found through our testing surrounding this that having it go out and just randomly try to find something can sometimes lead to weird results, though I think there might be some ways that we can shortcut.

data there. So it's just another way that we might be able to dip into that water. We do have the base underpinnings of that idea moving so we can explore that.

#### Bob Charron

We could potentially give you like 3 options with confidence levels for each and you pick the one that you want to use or none of the above, I'm going to create my own account kind of thing. That's cool. Okay.

#### Sean McCarthy

Right.

Yeah, yeah, and so we'll begin looking at.

how and when it makes sense to cut that in to try to shortcut work.

#### Bob Charron

The other thing I'll just point out, I know this is probably obvious, but we're dealing with a lot of people with a lot on their plate and the simpler the better. We're asking for something complicated, but with a simple interface, as much as possible, because it's just, if they're not doing it regularly, you understand, it's just like the, it's like the FMAM tool, like the.

**[cross talk]**

#### Bob Charron

They're not going to be like back-end wizards, so...

#### Sean McCarthy

We are, Kevin and I are working through that one and I will keep that very same principle in mind when Joe and I begin work on the director side of this. Joe, if you don't mind, since, well, we have an hour, sorry, for some reason I thought it was 1/2 an hour, it was an hour.

#### Bob Charron

Racing through this song for no reason.

#### Joe Theuerkauf

Yeah. Slow down, Sean.

#### Bob Charron

Time to serve some drinks.

#### Sean McCarthy

Joe, if you want to show us what we do have and we can kind of talk about it from the interface of this is sort of Ryan's tool and just the bare bones of what will become the thing. So this is also, it might be a bit of what...

some of the fields that will be used for more of the mining side for the account managers to dig in afterwards. But right now, and actually here, Joe, you can walk us through what you got.

#### Joe Theuerkauf

Sure. So this is meant to mimic the original interface. There's basically, we went with a one-to-one with what we originally had. We pull in data on the back end through a routine job that runs automatically.

Currently looks back a week at a time, so whenever it runs, it looks back a week. There are some other parameters that we set on it, so right now it is pre-filtering some, but we can adjust those, we can add, we can remove whatever parameters we need. But for right now.

We're looking at the ability to search by the minimum value of the project when it's been updated. Construction date range wasn't originally known, but we can, that is a data point that's available, so we can pull that out. And then, you know, some other ones.

The main focus was that you needed to be able to pair up, build central project to a Salesforce.

something. So we started with filtering anything that needs a Salesforce account assignment. And then there's also a filter for I have an account, but I don't have a project yet. So with that in mind, yeah, go ahead.

#### Sean McCarthy

And that will sort of change that this right now, it will bubble up the ones that Ryan, that meet all those criteria that, you know, based around that document that he just showed, limited to just those as well as the Salesforce project. That's the whole point is we will be using these to create the Salesforce project.

So the primary data point and really the only focus for what lands on this dashboard really will be, it meets all the criteria. We know we want to create a project out of it, but we have no link to Salesforce. And that will be the only ones that show here, just to kind of talk that through fully.

#### Joe Theuerkauf

Right. Yeah, bear in mind, this is what was built before we got about 90% of that process that you described. So this is all based on, you know, what was there originally. And I don't know if even Juan fully understood that process. So you can open a build central project, you can view the details of the project, you know, whatever other metrics you want to use, whatever data points you want to see here, and then right now we have the ability to search our internally synced Salesforce project data.

... account and project data. So if we was that, Sean, you can see.

#### Sean McCarthy

UPMC.

Not that obviously this one is UPMC, but you know, with.

#### Joe Theuerkauf

Yeah, yeah. I mean, just as an arbitrary example. So when you search, you get a list of the available accounts matching from Salesforce. If you select one of those and assign it, you will automatically get a list of projects available, or you can search by them.

#### Sean McCarthy

Which will will be necessary on on this on this screen.

#### Joe Theuerkauf

Yeah, yeah, it sounds like that's going to be separated anyway. So for the purposes of this, you know, kind of disregard half of it, it'll be a separated step. Once you've assigned, you can either create, you know, a Salesforce project or assign one to it.

Um...

You, yeah, you do have the ability to create a Salesforce account, but if one is assigned already, you have to unassign it first. So this gives you the ability to create a Salesforce account. If I do this right now, it'll create just a dummy account.

and then offer to create the project as well. Again, that's also dummy data right now. So it has just created these two fake things for Salesforce that are linked on the build central side. So none of this is going to sync to Salesforce yet.

Once we understand the rest of the process, we can, you know, get that set up as needed.

So that's kind of the long and short of it. There's not a whole lot to this MVP. And it sounds like that's a good thing because we have a lot of functional separation to do.

#### Sean McCarthy

Yeah, and I think we can begin. Again, we have a lot of the other components that we just talked through about process already sort of mapped out that we can cut over, I think, pretty readily. So once we get the bones of it, we can then evaluate how long just getting something put together to begin.

what we know is actually going to need to be done for Ryan side of it, for the director side, as well as for the sort of ad hoc account manager search, and then begin pairing that back. I think critically, we'll need to just get that document and then begin figuring out how to bubble up.

to Ryan which ones actually need to be done and those that aren't, that we can pair back initially, we just roll it onto the directors side immediately. So I think there's plenty of Rd. that we can run before we even.

I understand enough now to get us moving in the right direction, and we can get some actual MVP put together and then, you know.

Get back together.

#### Bob Charron

But this may be part of it already, but...

If you definitely want the projects that we would typically bring in quarterly, one-on-one batch them quarterly, so maybe like October 1st, January 1st, April 1st, July 1st, there's a batch that's created based on the filtering, if that's possible, right? And then, and then there's an auto message sent to the RSDs.

the director saying, hey, the batch is ready, go review them. And then there should be a final approver. OK, Keith, myself, or Caroline would be the final approver on the assignment. I'm not saying that the RSDs are going to steal things from each other, but there is sometimes some competition for like, I'm going to say competition, but somebody may not review it.

properly, like a lot of the RSDs don't necessarily know what's a government project versus not a government project. There's some overlap there. So I think having a final set of eyes on that batch before it gets pushed into Salesforce makes sense.

#### Sean McCarthy

Okay, so there's actually 2 approval steps that are needed. So it's the director level and then a final.

#### Bob Charron

Director claims, and then Caroline, myself, or Keith can push it into into Salesforce is what I'm thinking.

Otherwise, you could have some Irish D go in there and pick something. I want that one. Whoever gets in there first gets gets the spoils, you know what I mean? Potentially.

#### Sean McCarthy

Got it. Okay. Right.

Right, yeah, yeah.

Okay, so, and then the other bit that you had said there is you want this basically batched quarterly, meaning that you want the us to roll everything up into the quarter. Obviously, Ryan can be, you know, working it as a dashboard as it sort of goes along, so he doesn't have like a...

you know, 400 to do all in, you know, one time. So we can work with Ryan on how the pace that. But then for the director side, you want that basically, they are prompted to review it on a quarterly basis. Is that, am I?

#### Bob Charron

It gets the batch gets created the beginning of each quarter, then there's a message that goes to the RSD saying, hey, the batch is created for the quarter, which is what Ryan does now, he sends an e-mail to the team. We go in, let me see if I can find the spreadsheet, just so you can see what we do now, just as a, it doesn't have to be exactly the same, but.

**[cross talk]**

Brian, you send that from SF Admin or you send it from your own e-mail address typically.

#### Ryan Furtado

It's for mine.

#### Bob Charron

Wait, here it is. I got it. 8-4.

So, Ryan sends us this list and then this is the original list, so this is not mocked up, marked up, excuse me, but basically this is all listed. Let me see if I can find the actual one. Hold on a second. The link, I don't have it handy, but I can find it pretty quickly.

Thank you.

Oh, it's the only one.

Alright, gonna be a liar. Ryan, do you have that handy to link by any chance, or can you find it fairly quickly?

I think it's gonna be useful to look at.

#### Ryan Furtado

So yeah, so generally these are all these will be all new potential projects. Add like a note field so they can mark up whatever they want. A column field divided up by the manager.

So, based on either the company name or the tenant, try to link the account IDs, and wherever I can't find a good match, I'll just leave it blank, provide them this file, and they'll either...

Find the appropriate account in Salesforce and provide the link or the ID, or they'll create the account and then provide that information afterwards.

#### Bob Charron

In addition to that, we're also looking at ones like Joseph sometimes gets some of the projects for some of the counties or some of the tribal locations that Brandy Quesinberry would typically get just because of the way, I mean, it's impossible for Ryan to split them up perfectly because there's public, private and public private projects in Build Central. So they don't always get bucketed exactly the way they should be, the way we look at them.

It's based on whoever at Build Central decided to designate it when they get the project in their system. So that's the kind of...

manual review that's required to make sure they get assigned to the right people.

#### Sean McCarthy

Got it. Okay, so not, yeah, so not only Ryan's tool is going to need to be able to link to a Salesforce account, but we also can't assume that we can automatically know which sales director that needs to be routed to because of this. There is no like, all right, that's interesting.

#### Bob Charron

Generally speaking, the public stuff would go to me because it's government, typically. There are some exceptions, which again is part of the review process. The private is almost always going to the commercial folks. And then there's the public-private going either direction. And now on top of that, we've got lab account managers. So I have to look through every description and find

anything that says lab or research or life science like this, it's crazy because it's just not that simple to assign directly to the lab account managers. I have to do that.

#### Sean McCarthy

Okay, got it.

#### Ryan Furtado

And then to add one more wrinkle, there's certain customers like Kaiser or Encompass that aren't just one territory.

#### Bob Charron

I think a search filter for each data point, like the project description would be useful if I, at the top of that batch, for example, if there were a filter and I could type in research or life science or something like that, and they would only show the project that had that in the description. And then I'd be able to designate them more quickly.

Just as an idea, if I'm getting too far into the details, but because it's kind of choppy, having the filtering ability would help us narrow things down more quickly than having to just basically look at each line manually.

#### Sean McCarthy

Yeah, yeah, I mean, yes, I for sure agree as well as we can use some of that to try to help suggest that because this is going to be essentially...

So is this, that is Ryan's tool view, right? Like that'll be what Ryan's doing. So does that need approval from you and Keith and like?

#### Bob Charron

Ryan's not going to do anything anymore, right? I mean, we don't we need Ryan, nothing personally. I keep your job, Ryan, sorry. You got plenty, you got plenty more to do.

#### Joe Theuerkauf

Bye, Ryan.

**[cross talk]**

#### Ryan Furtado

I'll see my way out of this conversation now.

#### Sean McCarthy

Yeah, I mean...

Eventually, yes, it'll come for us all. But for right now, we still are going to have a human linking the Salesforce as well as now verifying what director it needs to be bucketed into. Does that process need to have any sort of oversight?

or that just then goes to Ryan or whoever is designated as that role, then says yes, and then it ends up in that director's quarterly bucket assign tool, whatever.

I just want to make sure I'm understanding the flow, which again, I really don't think that we need another step of validation here, but I just want to make sure that I'm being, we're bringing those things up to the front.

#### Bob Charron

Yeah, I, I think.

No, I think I think there could be automation to to who gets assigned to the projects, and then the manual review will allow us to override who's assigned to them.

#### Sean McCarthy

Right, okay. And yeah, and also then there's the review of, you know, you, Caroline and Keith doing the final sign off before it lands in Salesforce anyway. So I think we're probably pretty safe there. I just wanted to talk that all the way through because this is.

#### Bob Charron

No.

I just want to be able to see everything that's been assigned, how it's been assigned before it goes to production. Like I said, I just don't want one RSD running through saying, these are online, and they go in and nobody has a chance to look at them before they assign them. That's all.

#### Sean McCarthy

Interesting.

No, absolutely, and that that that makes that makes a lot of sense. I'm I I definitely get the the process why we need each of these sort of stops, checkpoints.

#### Bob Charron

Yep.

#### Sean McCarthy

All right, I think first steps first. I mean, we can take a run at creating the, I keep saying Ryan's view, but the assignment tool, we can revamp what Joe has already done and get a version of that.

which then will feed the next tool set, which is the director's, you know, the director's quarterly assignment, which then will feed a final step. And I think, yeah, Joe and I will get our heads together about, you know,

What that looks like, can propose some stuff, and since Ryan, you are the primary user there, we can reach out to you and, obviously, Bob, if you want, we can add you into any like check in meetings there.

#### Bob Charron

Yeah, if you have any questions that you're trying to like design it and like when this work, if it's not going to be useful, just reach out. I'll jump in for sure.

Yep.

#### Sean McCarthy

Yeah, and I mean, Karen, I mean, we can, everybody can be included. We can just add everybody as optional, those sorts of things. It just, with it being the primary user, we just want to make sure we're focusing on whatever Ryan thinks will be the easiest to make sure that side of it. We can take initial steps to try to do integrations with.

you know, suggestions and all of that. I'd like to get just the core of it working with some basic searches and then integrate that stuff in as we go. This is not going to be a...

We're not going to get you a version one and then not talk to you in six months kind of thing. Like this is going to be a process that we will be working on for a while, just hearing what we're talking about. And but I what I'd like to do is get us, you know, get this tool working, build in the under.

that we actually need for the rest of the flow and get you able to using the tool as quickly as possible is our goal to figure out what else we're missing and you know all of that that sort of stuff. But now that I...

I now understand what we're going for, at least, which is a good thing.

#### Bob Charron

Are you planning on doing the AM interface for outside of scope projects in parallel with the other one or one before the other? I'm just...

#### Sean McCarthy

I would like, I mean.

I don't know that answer again.

#### Bob Charron

I was just going to say, if you are looking for priority, I would say that the quarterly upload would be the first priority.

#### Sean McCarthy

Right, yeah, and I mean that that feels like the where the core the work that we're trying to replace, you know, like get make streamlined is, so we can definitely set that to the the side though, you know, again, Joe and I will discuss and figure out where.

where that side of it will land and how we might be able to get that added in, since that'll be kind of tool four-ish, sort of if we're talking about this as like a tool set, a view, an interface, a different style of interface with the same data set. So.

Okay.

#### Bob Charron

I have one other question. Sorry, while we're having a conversation, do you ever envision this being somehow linked directly into Salesforce?

#### Sean McCarthy

You mean to be able to interface with the tool in Salesforce, like sign into Salesforce?

#### Bob Charron

Yeah, just asking, or if that's like not in your in your thought process at this point.

#### Sean McCarthy

I am hesitant to answer that question. So my general feeling, the Salesforce wrapper is something that we can do and depending on the step and all of that and how much it helps the user's workflow, we can consider that. I definitely do not want to consider that as a phase one. My

My core concept for some of the tools that we're building is that we house them inside of our own framework. This is, you know, we can build interfaces and even just expose API endpoints and do all sorts of stuff that we want to do.

Later on, as well as just, you know, a a iframe wrapper inside of Salesforce, there are oddities that that generates that for an MVP. I, we can we can absolutely talk about that. Let's get the core tool set working, because I I know there is a long-term goal of keeping sales staff as much in.

#### Bob Charron

Yeah, no, I'm just thinking long-term, but...

#### Sean McCarthy

Salesforce exclusively as humanly possible. I understand and I agree with some of that with some of these types of tools.

I would prefer not to make it a requirement unless you tell me that that is the requirement. Okay.

#### Bob Charron

It's not right now. No, I'm just thinking like, I'm just thinking what the future looks like. And just so you know what the vision is eventually, would love to get to the point where if I'm in Kaiser Permanente's account, I'm in the IDN, right? And I've got all my sub facilities. I can go in on a tab in Salesforce and see all of the projects that are created.

in all of the project information that's not created yet. So it's on Caroline at a trade show and I'm using Popple. I can see all the projects they're working on and have an intelligent conversation with them with a list right in front of me without having to run reports and stuff like that.

#### Sean McCarthy

So those are two different things. So like if you're saying you want just the data to be able to be bubbled up in Salesforce, absolutely. Like we can do that in.

**[cross talk]**

more of a straightforward path. I'll need to...

#### Bob Charron

That's just mapping data points, right? That's basically all that is for the most part.

#### Sean McCarthy

Right, yeah, like we can push in the data points for viewing or we can give a view only. I thought you were saying you wanted all of the interface to be held inside of Salesforce and what we were talking about. Those are two, now, sorry, I misunderstood the question.

#### Bob Charron

It, it could, it could, it could be useful, like, if I were in Kaiser Permanente data to be able to pick a project that's in their in their account that's not a project yet and turn it into an account. I guess that could be interesting, but for now it would be just visibility, and that's a long, long-term goal of like...

#### Sean McCarthy

Right. I mean, this is my, my now hearing what we're actually wanting to do with and what the process we're replacing. This is going to be a long-term project. It'll have a prominent, you know, views. There'll be multiple side projects that come out of this. What you're discussing is what I would say is like a

#### Bob Charron

Long, long-term.

Yep.

#### Sean McCarthy

Is a side project against the primary, you know, structure that we're building out, right? Yeah, so I mean, it's it's definitely interesting and it's something that we can do.

#### Bob Charron

Phase four or five or six, or whatever it is, yeah, yeah, so.

#### Sean McCarthy

I definitely don't want to say, let's do it now, though, because I'd rather just get you guys having the efficiency boost.

#### Bob Charron

I don't need to. I want to focus on the basics, like just the basic process that we want to move along is quarterly uploads and being able to pull projects in that you identify that are outside of the normal filter scope.

#### Sean McCarthy

Okay, yeah, yeah, and that I think we can build a workflow around it. Well, yeah, I mean, I...

#### Bob Charron

That's it.

#### Sean McCarthy

It is good to know where our bounds are, though. So now we kind of see the edges, so that's great. Yeah, just while we got the group here, I have a trillion questions, but I'm going to save all of those to Pastor Ryan once we get the doc and begin.

working on that side of it. Joe, did you have any general large, larger questions that we think we might be better off to get now?

#### Joe Theuerkauf

I think right now we've got kind of the rough idea, you know, of the flow that we need to make changes to. So, you know, specifics will probably just have to come up along the way. Right now, you know, it would be too much detail.

#### Sean McCarthy

Yeah.

Understood.

#### Bob Charron

All right, I have a question. It's a question I always ask at the end of every call. I'm not pressuring. I say this every time and I mean it. I'm just going to get a general sense of timeline for next get together steps, whatever it is.

#### Sean McCarthy

So that one.

Based around what I know is coming next week, I think maybe meeting in two weeks with the option of maybe canceling that if we already know the ground to run. I think we have plenty of work to do that, you know, we could easily fill two weeks with just based around what we talked about.

But I think maybe just tentatively scheduling a check-in, you know, for two weeks if everybody's good with that, just to see if there's anything that we need or any other documentation. If we have anything to show, then great. If not, you know, we can cancel it and just free up everybody's schedule.

A little bit, but I mean.

#### Bob Charron

We're talking like maybe like Wednesday the 2nd of September. Is that what you're thinking roughly?

#### Sean McCarthy

Um, is that, oh my God, this month has just disappeared on me. Oh my God.

#### Bob Charron

Yeah, I'll be in Brazil on that day, but I'll do my best. I'll ask my wife if she'll allow you on board.

**[Brazil banter]**

#### Bob Charron

Awesome. Thank you guys. Really appreciate it. And again, if you need anything, any questions or anything, I'm available. I know Caroline's available. Not to speak for Caroline, but Ryan, you're welcome.

#### Ryan Furtado

I may or may not be available, who knows?

#### Caroline Hitchcock

Yeah.

#### Sean McCarthy

Ohh, Bob, do you have just a second to to hang out for OK? Thanks for the meeting, everybody.

#### Joe Theuerkauf

Alright, I'm gonna drop. I'll see you guys.

---

---

#### Sean McCarthy

Sorry to, I just, since I have your ear, I just wanted to walk through something mainly to understand.

#### Bob Charron

You got something for SMAN?

#### Sean McCarthy

what I am looking at. So I was peeking at this because of my team's usage and wanting to deal with them about what's going on on that side of it either.

I wanted to understand where my team is at. So I came in here and did this. And I was very surprised to see that your name is third in the list of.

#### Bob Charron

I use it, I use it all the time.

#### Sean McCarthy

Well, so that, the token, absolutely. What was surprising, and I just wanted to understand, is the 33,000 lines of code that were generated, that I just, I kind of want to know.

What's going?

#### Bob Charron

What generates lines of code? I guess I don't know what. If I'm generating lines of code, I'm not sure what's generating it.

#### Sean McCarthy

Well, yeah, so that that and that that actually that makes me feel so much better. The my what I wanted to check in with you and just make sure I want to understood if there were other needs that you had that I can assist with is when generating lines of code what they're being used for.

because of some of the security incidents that we've had.

#### Bob Charron

Okay.

#### Sean McCarthy

My focus is really and is not to pry at all because I this literally none of my business.

#### Bob Charron

No, I've got nothing to hide. I use it only for work. I have my own personal account that I pay for, so we're good.

#### Sean McCarthy

Oh yeah, I mean, the lines of code thing.

#### Bob Charron

And I, and I, and I recognize, you know, obviously the security of the company is first and foremost important, but what generates the lines of code, I guess? What actions?

#### Sean McCarthy

So if you said give me a script that or if you said

One thing that is likely to be generating yours, and I just wanted to talk that through, is probably like if you said, here's 4 spreadsheets, I need a way to...

you know, combine these in a certain manner by running either a script or it has to work as an agent.

#### Bob Charron

So it's me asking for a script. Is that what you're saying? That like code that will...

#### Sean McCarthy

Well, no, so it might not even be you saying like, write me a script. It might just be, here's data, combine them together, and it.

#### Bob Charron

Well here, I do a lot, I do a ton of that because I don't like wasting my time. And you know, like, like when we're dealing with, I'm working on a project right now where I'm trying to take all of the accounts in Salesforce that have been auto assigned to Trish Motta because the A plus system is set or was set.

#### Sean McCarthy

Right, of course.

#### Bob Charron

to assign any suspended accounts to her, right? Which unfortunately left us with no history of who owned the accounts before her. So now we're trying to like figure out who the hell we're going to give these to. So instead of me like, we're going to take 6,000 accounts and look at each one manually. So I've asked it to basically, I got A plus, A plus account names, numbers.

#### Sean McCarthy

Right.

#### Bob Charron

city, state, zip code. I use that information along with the FMAM zip code export. Like I said, try to match this stuff, use the three digit, use the five digit zip codes. Tell me if this is a government account versus a commercial account, all those kinds of things. Try to mash all that together to reduce the amount of time it takes people to do the work. That's what I'm doing.

#### Sean McCarthy

Yeah.

Perfect. So like all of this, this is really just a check-in to make sure so.

#### Bob Charron

Yeah.

#### Sean McCarthy

With the advent of AI, there are, if you were saying, I am writing basically a parallel piece of software to run on my computer to do X, Y, and Z, those sorts of things become very dangerous and become security holes.

#### Bob Charron

Ohh, no.

#### Sean McCarthy

And so that's really, I just, I'm checking in because...

#### Bob Charron

You're giving me far too much credit.

#### Sean McCarthy

Well, I mean, it's honestly, I was really impressed by the number of lines that you'd produced. I was like, because Jeff and I have been running on it for months now and we use it as like a primary thing to get some of the projects sort of stood up quickly. And so I was just like you.

#### Bob Charron

Yeah.

#### Sean McCarthy

beat out Kevin in your use of it. I was like, whoa. I then wanted to just check in to make sure there wasn't one anything that we can do outside. I mean, I know we're trying to be as assistant in anything that we can. It was mainly just to make sure that there wasn't like an actual piece of software.

That was running, spun up, and acting on your computer through all that, and it I, and if that's what you're telling me you're using it, that's that is why what we should be doing with, and so, like, I'm not like here to...

#### Bob Charron

No, no, I'm not offended. I'm glad you're asking me because if I was doing something unbeknownst to me that was a security risk, I would want to know about it.

#### Sean McCarthy

Right, and it's more of like I just happened to stumble upon it and I was like, well, I have a call with them. I might as well talk that through. So that's great. I forget I said anything. It was more of like, I'm.

#### Bob Charron

Oh, they're not a bit. I don't feel like you're questioning my integrity in any way, shape or form. So don't even think twice about it. I am kind of interested though. I don't know if anybody's given this consideration. Maybe this is for you and or Peter or whoever, but it would be really useful for maybe some of the sales directors management to get some sort of a training on how to use.

Bob Charron 54 minutes 5 seconds

GPTs and projects and stuff like I'm still not really sure what to do when I want to create a recurring process. If I've used I started using projects, but I know you can create GPTs, but I don't know how to do it. I honestly don't have the time to go searching for it on the internet and figure it out. So that would be pretty cool.

#### Sean McCarthy

Right, right, yeah.

I think Juan actually has something like that.

coming or he's working around it. My team, we're trying to get some of our nuts and bolts in place to like put boundaries on it because that's what the problem we're having is I have guys just be able to like access the system and do all of this and I'm like, no, just hold on.

#### Bob Charron

You can do that. You should not necessarily be doing that.

#### Sean McCarthy

Yeah, yeah, like we have unfortunately too many keys to the kingdoms to just be like willy-nilly about some stuff. The actual agent creation projects and how to handle and creation of the GPT objects, I think is very useful that we should and hopefully I'm going to talk with Juan when he gets back to see sort of where.

he's at with that and sort of begin talking around that because I do think that'd be helpful if only for my team to to be able to use some of that stuff because we're when I said we're beginning to explore the agent side of it for some of our own tooling, that is what we're doing. I mean we're going into that.

the ChatGPT interface creating an agent that goes and looks at vendor websites to try to find addresses to pair them back with Salesforce data. Like, that's what we're.

Doing without having to write a line of code, if other people in the company can find uses, which, how many uses could there be? There's so many, so like...

#### Bob Charron

I can think of millions of uses, and one thing that would require guardrails, I'm sure, is integrating Power BI and other data systems that we have, bringing it all together through ChatGPT would be phenomenal.

#### Sean McCarthy

It is, it's a, it's, there's a lot there. It is a brave new world. We are on just the tippy top of the iceberg, you know, and a lot is going to be coming. So it is something that I know Juan and Peter have been thinking around about how to

get some of the messaging out. Though if I'm being honest, like we're exploring this, like nobody on this team is an expert of what I would say, an expert in open AI usage. And like we are.

#### Bob Charron

Yeah, I gotcha. Yep. It's a learning curve for you guys too. You're far ahead of us, but it's still like, it's so vast, right?

#### Sean McCarthy

Kids.

Yeah, and there's a lot there that, you know, comes with like a decade of research that other people have been doing that no one on this team has been a part of that. So we are...

Yeah, we can and I'm sure we'll be producing things like that though, hopefully sooner rather than later, because again, my team could use it just as well as your team's too. So, okay, yeah, so again, I appreciate you taking a minute. It was more, I just wanted to make sure there wasn't any...

#### Bob Charron

Yeah, thank you.

#### Sean McCarthy

anything that we could help out with.

#### Bob Charron

I always, I always end up on the list. Juan showed me about six years ago that I had the most amount of emails in the company like that. I don't know if that's good or not, but...

#### Sean McCarthy

Well, I mean, I will say this, like, whenever I'm on, I always see you green. So I know that you were a man who's hard at work and doing a lot of different things. It's always impressive to see how many projects you got.

#### Bob Charron

All right.

You guys, you guys work a ton of hours, and I don't look at it as a badge of honor either. That's not how I measure my success, but...

#### Sean McCarthy

I know, I know it. I, yeah, it's been a...

I'm hoping that we're going to be able to at least level set that because I am not lying. I've been pushing this team super hard and I will have to stop doing that at some point.

#### Bob Charron

Really breaking point, yeah.

#### Sean McCarthy

Yeah, we're we're we're getting everything set up though, so that's the important part, yeah.

#### Bob Charron

Well, thank you. I appreciate all your effort. Thank you, Sean.

#### Sean McCarthy

Yeah, absolutely, Bob. Again, it was nice talking with you on this stuff. So yeah, we'll get something moving and reach back out.

#### Bob Charron

Sounds good. Thanks. See you. Bye.

