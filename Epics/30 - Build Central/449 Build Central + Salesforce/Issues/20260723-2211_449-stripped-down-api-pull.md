# NewRivers #449 Take 4

**Examine AllRivers code:**

- `./allrivers/syncJobs/buildCentral`
- `./allrivers/syncJobs/syncDaily.sh`
- `./configuration-dist.toml`
- any other related code

Keeping the scope extremely tight:

- Adapt the BuildCentral API pull to purely pull the data it currently does that populates `datasync.buildCentral`
- EMPHASIS: No comparison to other internal data, no matching.
  Just pull, normalize and store in new `newrivers.build_central_*` table(s).
- The data pull will be on a cycle, so determine how "new" data can be discerned from existing data.
    - Are there timestamps indicating created/modified?
    - Is AllRivers doing something like that already we can take in the conversion?
- Adapt the existing constraints on what gets collected.
- Reconstruct just this basic data-collection in newrivers as a Laravel job.
- Add an artisan command "`buildcentral:pull`" so the job can be run manually as needed.
- For the command output, display new (and updated, if applicable) records collected.
- Naming conventions for tables, models, etc. must follow Laravel conventions.
- Immediate need is just the tightest set of normalized tables necessary.
- Convert the TOML information (which I presume has credentials, etc.) into `.env` info.
    - Generate this `.env` in `$HOME/dev` so it isn't accidentally committed to newrivers.
