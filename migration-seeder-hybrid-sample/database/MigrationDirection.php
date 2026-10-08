<?php

declare(strict_types=1);

namespace Database;

/** Indicates whether a maintenance operation is being applied or reversed. */
enum MigrationDirection
{
    case Up;
    case Down;
}
